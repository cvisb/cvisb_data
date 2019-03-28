import { Component, OnInit, Input, ViewEncapsulation, ViewChild, ElementRef, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import * as d3 from 'd3';

import { HlaService } from '../../../_services/';

@Component({
  selector: 'app-allele-circle-packing',
  templateUrl: './allele-circle-packing.component.html',
  styleUrls: ['./allele-circle-packing.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class AlleleCirclePackingComponent implements OnInit {
  @Input() data: any;
  @Input() scale: number;
  @Input() genotype: string[];
  @ViewChild('allele_count') private chartContainer: ElementRef;

  // plot sizes
  private element: any;
  private margin: any = { circleText: 1.05 };
  private width: number = 600;
  private height: number;

  // --- Selectors ---
  private chart: any;

  // --- Scales/Axes ---
  private colorScale: any;

  getSVGDims() {
    // Find container; define width/height of svg obj.
    this.element = this.chartContainer.nativeElement;
  }


  constructor(
    // Whether to be rendered server-side or client-side
    @Inject(PLATFORM_ID) private platformId: Object,
    private hlaSvc: HlaService
  ) {
    // Cross-plot mouseover behaviors: highlight locus and/or allele
    // Listen for the selection of a locus
    hlaSvc.selectedLocusState$.subscribe((locus: string) => {
      if (locus) {
        d3.selectAll(".node--leaf")
          .classed("masked", (d: any) => d.data.locus !== locus)
          .classed("enabled", (d: any) => d.data.locus === locus);

        d3.selectAll(".node--locus")
          .classed("locus-masked", (d: any) => d.data.locus !== locus)
          .classed("locus-enabled", (d: any) => d.data.name === locus);
      } else {
        d3.selectAll(".node--leaf")
          .classed("masked", false)
          .classed("enabled", false);

        d3.selectAll(".node--locus")
          .classed("locus-masked", false)
          .classed("locus-enabled", false);
      }
    })

    // Listen for the selection of a specific allele
    hlaSvc.selectedAlleleState$.subscribe((allele: string) => {
      if (allele) {
        d3.selectAll(".node--leaf")
          .classed("allele-masked", (d: any) => d.data.name !== allele)
          .classed("allele-enabled", (d: any) => d.data.name === allele);
      } else {
        d3.selectAll(".node--leaf")
          .classed("allele-masked", false)
          .classed("allele-enabled", false);

      }
    })

  }

  ngOnInit() {
    if (!this.genotype) {
      this.genotype = [];
    }
    if (isPlatformBrowser(this.platformId)) {
      this.getSVGDims();
      this.createPlot();
    }
  }

  createPlot() {
    this.height = this.width;
    let t = d3.transition().duration(2000);

    // this.data.sort((a: any, b: any) => (b.count - a.count) || (a.key < b.key ? -1 : 1));
    //
    let temp_data = [];
    for (let i = 0; i < this.data.length; i++) {
      let name = this.data[i].key;
      let kids = [];
      let values = this.data[i].values;
      for (let j = 0; j < values.length; j++) {
        kids.push({ name: values[j].key, count: values[j].value.total, novel: values[j].value.novel, locus: name })
      }

      temp_data.push({ name: name, locus: name, children: kids })
    }


    for (let k = 0; k < temp_data.length; k++) {
      let cts = temp_data[k].children;
      let children_length = cts.length;
      let children_total = d3.sum(cts, (d: any) => d.count);

      cts.forEach(d => {
        d.freq = d.count / children_total;
        d.size = (d.count / children_total) * children_length;
      })
    }
    temp_data.forEach(d => d.children)


    let cdata = {
      name: "loci",
      children: temp_data
    }


    let svg = d3.select(this.element)
      .append('svg')
      .attr("id", "allele-circle-packing")
      .attr('width', this.width * this.scale)
      .attr('height', this.height * this.scale)
      .attr('viewBox', `0 0 ${this.width * this.scale} ${this.width * this.scale}`)
      .on("click", () => console.log(d3.event));

    svg.append("defs")
      .append("marker")
      .attr("id", "arrow")
      .attr("viewBox", "0 0 12 12")
      .attr("refX", 6)
      .attr("refY", 6)
      .attr("markerWidth", 12)
      .attr("markerHeight", 12)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M2,2 L10,6 L2,10 L6,6 L2,2")
      .attr("class", "arrowHead");

    let margin = 20,
      diameter = +svg.attr("this.width"),
      g = svg.append("g")
        .attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")")
        .attr("transform", `scale(${this.scale})`);

    // Grab color scale from common source: consistent between different HLA sources.
    this.colorScale = this.hlaSvc.locusColors;

    // Alpha scale: used to specify if novel allele.
    let alphaScale = d3.scaleLinear()
      .domain([0, 2])
      .range([0, 0.25]);

    // Pack the circles
    let pack = d3.pack()
      .size([this.width - 2, this.height - 2])
      .padding(3);

    let root = d3.hierarchy(cdata)
      .sum(function(d: any) { return d.size; })
      .sort(function(a, b) { return b.value - a.value; });

    pack(root);
    let nodes = pack(root).descendants();

    // div for tooltips
    let ttips = d3.select("body").append("div")
      .attr("class", "circlepacking-tooltip")
      .style("display", "none")
      .style("opacity", 0);

    function clearTtips(hlaSvc) {
      return function(d) {
        d3.selectAll(".circlepacking-tooltip").transition()
          .duration(0)
          .style("display", 'none')
          .style("opacity", 0);

        hlaSvc.selectedLocusSubject.next(null);
        hlaSvc.selectedAlleleSubject.next(null);
      }
    }

    // If you move the mouse quickly from a circle to somewhere else in the body, hide the tooltip.
    d3.select("body")
      .on("mouseover", clearTtips(this.hlaSvc));


    // define group for each node.
    let node = svg.select("g")
      .selectAll("g")
      .data(root.descendants())
      .enter().append("g")
      .attr("transform", function(d: any) { return "translate(" + d.x + "," + d.y + ")"; })
      .attr("class", function(d) { return "node" + (!d.children ? " node--leaf" : d.depth ? " node--locus" : " node--root"); })
      .attr("id", (d: any) => d.data.name)
      .each((d: any) => d.node = this);



    // Append circles
    node.append("circle")
      .attr("id", function(d: any) { return "node-" + d.data.name; })
      .attr("r", function(d: any) { return d.r; })
      .style("fill", (d: any) => <string>this.colorScale(d.data.locus))
      .style("stroke", (d: any) => <string>this.colorScale(d.data.locus))
      .style("fill-opacity", (d: any) => alphaScale(d.depth))
      .classed("novel", (d: any) => d.data.novel)
      .classed("highlight", (d: any) => this.genotype.includes(d.data.name));


    node.selectAll("circle")
      .on("mouseover", hovered(true, ttips, this.scale, this.hlaSvc))
      .on("mouseout", hovered(false, ttips, this.scale, this.hlaSvc));


    // Label locus; used only on unique alleles graph.
    var text = node
      .append("text")
      .attr("class", "label")
      .style("fill-opacity", function(d: any) { return d.parent === root ? 1 : 0; })
      .style("fill", (d: any) => <string>this.colorScale(d.data.locus))
      .style("display", function(d) { return d.parent === root ? "inline" : "none"; })
      .style("font-size", (d: any) => d.r / 2)
      .text(function(d) { return d.data.name; });


    // --- Annotations ---
    svg.select("g")
      .append("text")
      .attr("class", "annotation--hla-title")
      .attr("x", 0)
      .attr("y", 0)
      .text("Allelic frequency by locus");

    svg.select("g")
      .append("text")
      .attr("class", "annotation full-annotation annotation--upper-right")
      .append("tspan")
      .attr("x", this.width)
      .attr("y", 40)
      .text("Outer circle area =")
      .append("tspan")
      .attr("x", this.width)
      .attr("y", 40)
      .attr("dy", "1.2em")
      .text("number of unique alleles per locus");


    svg.select("g")
      .append("text")
      .attr("class", "annotation annotation--upper-right annotation--patient")
      .append("tspan")
      .attr("x", this.width)
      .attr("y", 40)
      .text("filled = allele of patient");

    svg.select("g")
      .append("text")
      .attr("class", "annotation simplified-annotation annotation--upper-right")
      .append("tspan")
      .attr("x", this.width)
      .attr("y", 40)
      .text("number of unique alleles per locus");

    svg.select("g")
      .append("text")
      .attr("class", "annotation full-annotation annotation--bottom-right")
      .append("tspan")
      .attr("x", this.width)
      .attr("y", this.height)
      .attr("dy", "-1.2em")
      .text("Inner circle area =")
      .append("tspan")
      .attr("x", this.width)
      .attr("y", this.height)
      .text("allelic frequency (within locus)");


    svg.select("g")
      .append("text")
      .attr("class", "annotation annotation--bottom-right annotation--patient")
      .append("tspan")
      .attr("x", this.width)
      .attr("y", this.height)
      .text("allelic frequency of population");

    svg.select("g")
      .append("text")
      .attr("class", "annotation full-annotation annotation--novel")
      .append("tspan")
      .attr("x", this.width)
      .attr("y", this.height / 2)
      .attr("dy", "-1.2em")
      .text("dark =")
      .append("tspan")
      .attr("x", this.width)
      .attr("y", this.height / 2)
      .text("novel");

    // top right arrow
    svg.select("g")
      .append("path")
      .attr("class", "swoopy-arrow annotation--upper-right")
      .attr("d", "M572 84 C 582 104, 570 134, 560 139")
      .attr("marker-end", "url(#arrow)");

    // middle arrow
    svg.select("g")
      .append("path")
      .attr("class", "swoopy-arrow annotation--novel")
      .attr("d", "M585 311 C 590 320, 585 344, 565 355")
      .attr("marker-end", "url(#arrow)");

    // bottom right arrow
    svg.select("g")
      .append("path")
      .attr("class", "swoopy-arrow annotation--bottom-right")
      .attr("d", "M560 550 C 565 530, 550 504, 535 504")
      .attr("marker-end", "url(#arrow)");

    // --- Tooltip mouseover function ---
    function hovered(hover, div, scale, hlaSvc) {
      return function(d) {
        // Prevent the body:mouseover from clearing the tooltip
        d3.event.preventDefault();
        d3.event.stopPropagation();

        if (d.data.name !== "loci") {
          hlaSvc.selectedLocusSubject.next(d.data.locus);
          if (d.parent.parent) {
            hlaSvc.selectedAlleleSubject.next(d.data.name);
          }
          // only show tooltips if the circle packing is full-sized
          if (scale === 1) {

            div.transition()
              .duration(0)
              .style("display", "inline-block")
              .style("opacity", 0.9);

            let html_payload = d.parent.parent ?
              // Allele frequency
              `<div class="title--allele">${d.data.name}</div>
          <div class="label--freq">${d3.format(".1%")(d.data.freq)}</div>
          ${d.data.novel ? '<div class="div--novel"><span class="label--novel">novel</span></div>' : ''}` :

              // Locus stats
              `<div class="title--locus">${d.data.name} locus</div>
          <div class="label--freq">${d.children.length} unique alleles</div>`;

            div.html(html_payload)
              .style("left", (d3.event.pageX + 15) + "px")
              .style("top", (d3.event.pageY - 28) + "px");
          }
        } else {
          div.transition()
            .duration(0)
            .style("display", 'none')
            .style("opacity", 0);
          hlaSvc.selectedLocusSubject.next(null);
          hlaSvc.selectedAlleleSubject.next(null);
        }
      };
    }





    //   var circle = g.selectAll("circle")
    // .data(nodes)
    // .enter().append("circle")
    //   .attr("class", function(d) { return d.parent ? d.children ? "node" : "node node--leaf" : "node node--root"; })
    //   .style("fill", function(d) { return d.children ? this.colorScale(d.depth) : null; })
    // .on("click", function(d) { if (focus !== d) zoom(d), d3.event.stopPropagation(); });

    // var pack = d3.pack()
    //   .size([400, 400])
    //   .padding(2);
    //
    // let root = d3.hierarchy(root)
    //   .sum(function(d) { return d.size; })
    //   // .sort(function(a, b) { return b.value - a.value; });
    //
    // var focus = root,
    //   nodes = pack(root).descendants(),
    //   view;
    //
    //   console.log(nodes)
    //
    // var circle = g.selectAll("circle")
    //   .data(nodes)
    //   .enter().append("circle")
    //   .attr("class", function(d) { return d.parent ? d.children ? "node" : "node node--leaf" : "node node--root"; })
    //   .style("fill", function(d) { return d.children ? 'blue' : 'lavender'; })
    // // .on("click", function(d) { if (focus !== d) zoom(d), d3.event.stopPropagation(); });
    //
    // var text = g.selectAll("text")
    //   .data(nodes)
    //   .enter().append("text")
    //   .attr("class", "label")
    //   .style("fill-opacity", function(d) { return d.parent === root ? 1 : 0; })
    //   .style("display", function(d) { return d.parent === root ? "inline" : "none"; })
    //   .text(function(d) { return d.data.name; });
    //
    // var node = g.selectAll("circle,text");

  }

}
