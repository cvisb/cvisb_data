import { Component, AfterViewInit, Input, ViewEncapsulation, ViewChild, ElementRef, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import * as d3 from 'd3';
import { mix, hex } from 'chroma-js';

import { HlaService } from '../../_services';

@Component({
  selector: 'app-allele-circle-packing',
  templateUrl: './allele-circle-packing.component.html',
  styleUrls: ['./allele-circle-packing.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class AlleleCirclePackingComponent implements AfterViewInit {
  @Input() data: any;
  @Input() scale: number;
  @Input() genotype: string[];
  @ViewChild('allele_count') private chartContainer: ElementRef;

  // plot sizes
  private element: any;
  private margin: any = { right: 75, bottom: 25 };
  private width: number = 600;
  private height: number;

  // --- Selectors ---

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
  }

  ngAfterViewInit() {
    if (!this.genotype) {
      this.genotype = [];
    }
    if (isPlatformBrowser(this.platformId)) {
      // Cross-plot mouseover behaviors: highlight locus and/or allele
      // Listen for the selection of a locus
      this.hlaSvc.selectedLocusState$.subscribe((locus: string) => {
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
      this.hlaSvc.selectedAlleleState$.subscribe((allele: string) => {
        if (allele) {
          d3.selectAll(".node--leaf")
            .classed("allele-masked", (d: any) => d.data.name !== allele)
            .classed("allele-enabled", (d: any) => d.data.name === allele);

          d3.selectAll(".node--leaf circle.circle-stroke")
            .classed("allele-masked", (d: any) => d.data.name !== allele)
            .classed("allele-enabled", (d: any) => d.data.name === allele);

        } else {
          d3.selectAll(".node--leaf")
            .classed("allele-masked", false)
            .classed("allele-enabled", false);

        }
      })

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
      .attr('width', this.width * this.scale + this.margin.right)
      .attr('height', this.height * this.scale + this.margin.bottom)
      .attr('viewBox', `0 0 ${this.width * this.scale + this.margin.right} ${this.width * this.scale + this.margin.bottom}`)

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

    let g = svg.append("g")
      .attr("transform", "translate(" + this.width / 2 + "," + this.width / 2 + ")")
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

    let node_ttips = svg
      .selectAll(".tooltip")
      .data(root.descendants())
      .enter().append("g")
      .attr("transform", function(d: any) { return "translate(" + d.x + "," + d.y + ")"; })
      .attr("class", function(d) { return "tooltip-cirle-packing" + (!d.children ? " tooltip--leaf" : d.depth ? " tooltip--locus" : " tooltip--root"); })
      .attr("id", (d: any) => d.data.name)
      .each((d: any) => d.node = this);



    // Append circles
    let stroke_ttip = node.append("circle")
      .attr("class", "circle-stroke")
      .attr("r", function(d: any) { return d.r + 4; })
      .style("fill", "none")
      .style("stroke", (d: any) => <string>this.colorScale(d.data.locus))
      .attr("id", function(d: any) { return "stroke-" + d.data.name.replace("*", "-").replace("@", "--"); })
      .style("opacity", 0);

    node.append("circle")
      .attr("class", "circle-fill")
      .attr("id", function(d: any) { return "node-" + d.data.name; })
      .attr("r", function(d: any) { return d.r; })
      .style("fill", (d: any) => <string>this.colorScale(d.data.locus))
      .style("stroke", (d: any) => <string>this.colorScale(d.data.locus))
      .style("fill-opacity", (d: any) => alphaScale(d.depth))
      .classed("novel", (d: any) => d.data.novel)
      .classed("highlight", (d: any) => this.genotype.includes(d.data.name));



    node.selectAll("circle")
      .on("mouseover", hovered(true, stroke_ttip, this.scale, this.hlaSvc))
      .on("mouseout", hovered(false, stroke_ttip, this.scale, this.hlaSvc));


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


    let tooltips_group = node_ttips.append("g")
      .attr("class", "tooltip-group")
      .attr("id", function(d: any) { return "tooltip-" + d.data.name.replace("*", "-").replace("@", "--"); })
      .style("display", "none");
    // .style("opacity", 0);

    // Tooltip paths
    tooltips_group
      .append("path")
      .style("stroke", (d: any) => <string>this.colorScale(d.data.locus))
      .style("fill", "none")
      .style("stroke-width", "1")
      .attr("d", (d: any) => `M${4}, ${d.r + 4} L${8},${d.r + 16}`)

    tooltips_group
      .append("rect")
      .style("stroke", "none")
      .style("fill", (d: any) => d.depth === 1 ? mix(this.colorScale(d.data.locus), "white", 0.6).hex() : "white")
      // .style("stroke", (d: any) => <string>this.colorScale(d.data.locus))
      .style("fill-opacity", "0.9")
      .attr("x", (d: any) => `${8}`)
      .attr("y", (d: any) => `${d.r + 16}`)
      .attr("width", 125)
      .attr("height", "3.5em")

    tooltips_group
      .append("path")
      .attr("class", "tooltip-rect--border")
      .style("stroke", (d: any) => <string>this.colorScale(d.data.locus))
      .style("stroke-width", "4")
      .style("fill", "none")
      .attr("d", (d: any) => `M${8}, ${d.r + 16}L${133},${d.r + 16}`)

    let tooltips_text = tooltips_group
      .append("text")
      .attr("class", "tooltip-allele")
      .attr("id", function(d: any) { return "text-" + d.data.name.replace("*", "-").replace("@", "--"); })
      .attr("y", (d: any) => `${d.r + 16}`);

    tooltips_text
      .append("tspan")
      .attr("class", "allele-label")
      .style("fill", (d: any) => <string>this.colorScale(d.data.locus))
      .attr("x", 12)
      .attr("dy", 4)
      .text((d: any) => d.depth === 1 ? d.data.name + " locus" : d.data.name);

    tooltips_text
      .append("tspan")
      .attr("class", "allele-frequency")
      .attr("x", 12)
      .attr("dy", "2em")
      .text((d: any) => d.data.freq ? d3.format(".1%")(d.data.freq) : `${d.data.children.length} unique alleles`);

    tooltips_text
      .append("tspan")
      .attr("class", "locus-novel")
      .attr("x", 12)
      .attr("dy", "1em")
      .text((d: any) => d.data.freq ? null : `${d.data.children.filter(x => x.novel).length} novel alleles`);

    tooltips_text
      .append("tspan")
      .attr("class", "allele-novel")
      .attr("x", "12")
      .attr("dy", "1em")
      .text((d: any) => d.data.novel ? "novel" : "");

    // dynamically adjust the width of the rect
    tooltips_group.selectAll('rect')
      .attr("width", (d: any) => `${(document.getElementById("text-" + d.data.name.replace("*", "-").replace("@", "--")) as any).getBBox().width + 10}`)
      .attr("height", (d: any) => `${(document.getElementById("text-" + d.data.name.replace("*", "-").replace("@", "--")) as any).getBBox().height + 5}`);

    tooltips_group.selectAll('.tooltip-rect--border')
      .attr("d", (d: any) => `M${8}, ${d.r + 16}L${(document.getElementById("text-" + d.data.name.replace("*", "-").replace("@", "--")) as any).getBBox().width + 18},${d.r + 16}`);



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
            let tooltip_selector = `#stroke-${d.data.name.replace("*", "-").replace("@", "--")}`;
            let text_selector = `#tooltip-${d.data.name.replace("*", "-").replace("@", "--")}`;

            // Make sure everything is off.
            d3.selectAll(".tooltip-group")
              .transition()
              .duration(0)
              .style("display", "none");

            d3.selectAll(".circle-stroke")
              .transition()
              .duration(0)
              .style("opacity", 0);

            // Turn on the selected one
            d3.selectAll(tooltip_selector)
              .transition()
              .duration(0)
              .style("opacity", 1)

            d3.selectAll(text_selector)
              .transition()
              .duration(0)
              .style("display", "inline-block")
          }
        } else {
          d3.selectAll(".tooltip-group")
            .transition()
            .duration(0)
            .style("display", "none");

          d3.selectAll(".circle-stroke")
            .transition()
            .duration(0)
            .style("opacity", 0);

          hlaSvc.selectedLocusSubject.next(null);
          hlaSvc.selectedAlleleSubject.next(null);
        }
      };
    }
  }

}
