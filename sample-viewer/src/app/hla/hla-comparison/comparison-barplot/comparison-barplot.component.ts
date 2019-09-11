import { Component, OnInit, OnChanges, ViewEncapsulation, ViewChild, Input, ElementRef, PLATFORM_ID, Inject } from '@angular/core';

import { isPlatformBrowser } from '@angular/common';

import * as d3 from 'd3';
import { HLAsummary, CohortSelectOptions } from '../../../_models';

@Component({
  selector: 'app-comparison-barplot',
  templateUrl: './comparison-barplot.component.html',
  styleUrls: ['./comparison-barplot.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ComparisonBarplotComponent implements OnInit {
  @ViewChild('comparison') private chartContainer: ElementRef;
  @Input() private data: any;

  private creationPromise: Promise<any>;
  private data_left: HLAsummary[];
  private params_left: CohortSelectOptions;
  private data_right: HLAsummary[];
  private params_right: CohortSelectOptions;
  private combined: HLAsummary[];


  // plot sizes
  private element: any;
  private margin: any = { top: 25, bottom: 35, beg: 5, middle: 0, end: 100 };
  private width: number = 400;
  private height: number = 300;

  // --- Selectors ---
  private left: any; // left plot
  private left_annot: any; // left plot
  private svg_left: any; // left plot
  private bars_left: any; // left plot
  private right: any; // right plot
  private right_annot: any; // right plot
  private svg_right: any; // right plot
  private locus: string;

  // --- Scales/Axes ---
  private x_left: any;
  private x_right: any;
  private y: any;
  private colorScale: any;
  private xLeftAxis: any;
  private xRightAxis: any;
  private yLeftAxis: any;
  private yRightAxis: any;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.creationPromise = this.createPlot();

      this.creationPromise.then(value => {
        this.updatePlot();
      })
    }

  }


  ngOnChanges() {
    this.data_left = this.data.left;
    this.data_right = this.data.data_right;
    this.params_left = this.data.params_left;
    this.params_right = this.data.params_right;
    this.updatePlot();
  }

  createPlot(): Promise<any> {
    return new Promise((resolve, reject) => {
      // Find container; define width/height of svg obj.
      this.element = this.chartContainer.nativeElement;

      // Append SVG
      this.svg_left = d3.select(this.element)
        .append('svg')
        .attr("class", "barplot--comparison")
        .attr("id", "left")
        .attr("width", this.width / 2 + this.margin.beg + this.margin.middle + this.margin.end)
        .attr("height", this.height + this.margin.top + this.margin.bottom)

      this.svg_right = d3.select(this.element)
        .append('svg')
        .attr("class", "barplot--comparison")
        .attr("id", "right")
        .attr("width", this.width / 2 + this.margin.beg + this.margin.middle + this.margin.end)
        .attr("height", this.height + this.margin.top + this.margin.bottom)

      // --- x & y axes --
      this.x_left = d3.scaleLinear()
        .rangeRound([this.width / 2, 0]);

      this.x_right = d3.scaleLinear()
        .rangeRound([0, this.width / 2]);

      this.y = d3.scaleBand()
        .rangeRound([0, this.height])
        .paddingInner(0.1)
        .paddingOuter(0);

      this.xLeftAxis = d3.axisBottom(this.x_left)
        .tickFormat(<any>d3.format(".0%"))
        .ticks(5)
        .tickSize(-this.height);

      this.xRightAxis = d3.axisBottom(this.x_right)
        .tickFormat(<any>d3.format(".0%"))
        .ticks(5)
        .tickSize(-this.height);

      this.yLeftAxis = d3.axisLeft(this.y);
      this.yRightAxis = d3.axisRight(this.y);

      // --- Create axes ---
      this.svg_left.append('g')
        .attr('class', 'axis axis--x axis--left')
        .attr('transform', `translate(${this.margin.end}, ${this.margin.top + this.height})`);


      this.svg_left.append('g')
        .attr('class', 'axis axis--y axis--left')
        .attr('transform', `translate(${this.margin.end}, ${this.margin.top})`);

      this.svg_right.append('g')
        .attr('class', 'axis axis--x')
        .attr('transform', `translate(${this.margin.middle}, ${this.margin.top + this.height})`);

      this.svg_right.append('g')
        .attr('class', 'axis axis--y axis--right')
        .attr('transform', `translate(${this.margin.beg + this.width / 2}, ${this.margin.top})`);

      // selectors
      this.left = this.svg_left.append("g")
        .attr("id", "left-graph")
        .attr("transform", `translate(${this.margin.end}, ${this.margin.top})`);

      this.left_annot = this.svg_left.append("g")
        .attr("id", "left-annot")
        .attr("transform", `translate(${this.margin.end}, ${this.margin.top})`);

      this.right = this.svg_right.append("g")
        .attr("id", "right-graph")
        .attr("transform", `translate(${this.margin.middle}, ${this.margin.top})`);

      this.right_annot = this.svg_right.append("g")
        .attr("id", "right-annot")
        .attr("transform", `translate(${this.margin.middle}, ${this.margin.top})`);

      resolve("Success!");
    })
  }

  updatePlot() {
    // Wait till the plot has been created before updating
    if (this.creationPromise) {

      this.locus = this.data.data_right[0].key.split("\*")[0];

      this.svg_right.classed(this.locus, true);
      this.svg_left.classed(this.locus, true);

      var t = d3.transition()
        .duration(500);

      // Merge together data
      this.data_left.forEach(element =>
        element.side = "left");

      this.data_right.forEach(element =>
        element.side = "right");

      this.combined = this.data_left.concat(this.data_right);

      let n_left = d3.sum(this.data_left, (d: any) => d.value) / 2; // divided by 2, since two alleles / patient
      let n_right = d3.sum(this.data_right, (d: any) => d.value) / 2; // divided by 2, since two alleles / patient

      // Find limits for x and y
      let pct_max = <any>d3.max(this.combined, (d: any) => d.pct);
      this.combined.sort((a: any, b: any) => {
        if (a.side > b.side) return -1;
        if (a.side < b.side) return 1;
        if (b.pct < a.pct) return -1;
        if (a.pct > b.pct) return 1;
      });
      // this.combined.sort((a:any, b:any) => b.key > a.key ? 1 : -1);
      let alleles = this.combined.map((d: any) => d.key);

      // --- Update domains of x & y axes --
      this.x_left.domain([0, pct_max]);

      this.x_right.domain([0, pct_max]);

      this.y.domain(alleles);


      // --- Create axes ---
      this.svg_left.selectAll('.axis--x.axis--left')
        .transition(t)
        .call(this.xLeftAxis)


      this.svg_left.selectAll('.axis--y.axis--left')
        .transition(t)
        .call(this.yLeftAxis);

      this.svg_right.selectAll('.axis--x')
        .transition(t)
        .call(this.xRightAxis);

      this.svg_right.selectAll('.axis--y.axis--right')
        .transition(t)
        .call(this.yRightAxis);

      // --- Create tooltip div ---
      let ttips = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("display", "none");



      let mouseover = function(hover, locus, combined) {

        return function(d) {
          ttips.transition()
            .duration(200)
            .style("display", "inline-block")
            .style("opacity", 1);


          let left_value = combined.filter((a: any) => (a.key === d.key) && (a.side === 'left')).map((x: any) => x.pct)[0];
          let right_value = combined.filter((a: any) => (a.key === d.key) && (a.side === 'right')).map((x: any) => x.pct)[0];

          let html_payload = `<div class='title--allele'>${d.key}</div>
          <div class='label--freq'>
          <span class='left'>${d3.format(".1%")(left_value ? left_value : 0)}</span>
          <span class='right'>${d3.format(".1%")(right_value ? right_value : 0)}</span>
          </div>
          `;

          ttips.html(html_payload)
            .style("left", (d3.event.pageX + 5) + "px")
            .style("top", (d3.event.pageY + 35) + "px");

          d3.selectAll(`.${locus} .comp-bars`).classed("hover--allele", (b: any) => d.key !== b.key);
        }
      }

      let mouseout = function() {
        ttips.transition()
          .duration(200)
          .style("display", "none")
          .style("opacity", 0);

        d3.selectAll(".comp-bars").classed("hover--allele", false);
      }

      // --- Create comp-bars ---
      let leftBars = this.left.selectAll("rect")
        .data(this.data_left);

      leftBars.enter().append("rect")
        .attr("class", "comp-bars left-comp-bars")
        .merge(leftBars)
        .transition(t)
        .attr("id", (d: any) => d.key)
        .attr("x", (d: any) => this.x_left(d.pct))
        .attr("y", (d: any) => this.y(d.key))
        .attr("width", (d: any) => this.x_left(0) - this.x_left(d.pct))
        .attr("height", this.y.bandwidth());

      // Necessary to add tooltips AFTER enter/append/merge, so that they properly update when data changes.
      this.left.selectAll("rect")
        .on("mouseover", mouseover(true, this.locus, this.combined))
        .on("mouseout", mouseout);

      leftBars.exit()
        .transition(t)
        .style("fill-opacity", 1e-6)
        .remove()

      // -- right --
      let rightBars = this.right.selectAll("rect")
        .data(this.data_right);

      rightBars.enter().append("rect")
        .attr("class", "comp-bars right-comp-bars")
        .merge(rightBars)
        .transition(t)
        .attr("id", (d: any) => d.key)
        .attr("x", (d: any) => 0)
        .attr("y", (d: any) => this.y(d.key))
        .attr("width", (d: any) => this.x_right(d.pct))
        .attr("height", this.y.bandwidth());

      // Necessary to add tooltips AFTER enter/append/merge, so that they properly update when data changes.
      this.right.selectAll("rect")
        .on("mouseover", mouseover(true, this.locus, this.combined))
        .on("mouseout", mouseout);

      rightBars.exit()
        .transition(t)
        .style("fill-opacity", 1e-6)
        .remove()

      // --- titles ---
      let leftTitle = this.left.selectAll("text")
        .data(this.params_left);

      leftTitle.enter().append("text")
        .attr("class", "title title--left")
        .merge(leftTitle)
        .attr("x", this.width / 2 - this.margin.beg)
        .attr("dx", 5)
        .attr("y", 0)
        .style("fill-opacity", 0)
        .transition(t)
        .style("fill-opacity", 1)
        .text(d => d.name);

      leftTitle.exit()
        .transition(t)
        .style("fill-opacity", 1e-6)
        .remove();


      let rightTitle = this.right.selectAll("text")
        .data(this.params_right);

      rightTitle.exit()
        .transition(t)
        .style("fill-opacity", 1e-6)
        .remove()


      rightTitle.enter().append("text")
        .attr("class", "title title--right")
        .merge(rightTitle)
        .style("fill-opacity", 0)
        .attr("x", 0)
        // .attr("dx", 5)
        .attr("y", 0)
        .transition(t)
        .style("fill-opacity", 1)
        .text((d: any) => d.name);



      // --- n-annotation ---
      let leftN = this.left_annot.selectAll("text")
        .data([n_left]);

      leftN.exit()
        .transition(t)
        .style("fill-opacity", 1e-6)
        .remove()

      leftN.enter().append("text")
        .attr("class", "n")
        .merge(leftN)
        .attr("x", 0)
        .attr("dx", 5)
        .attr("y", this.height)
        .attr("dy", -5)
        .style("fill-opacity", 0)
        .transition(t)
        .style("fill-opacity", 1)
        .text(d => `n: ${d}`);


      let rightN = this.right_annot.selectAll("text")
        .data([n_right]);

      rightN.exit()
        .transition(t)
        .style("fill-opacity", 1e-6)
        .remove()

      rightN.enter().append("text")
        .attr("class", "n")
        .merge(rightN)
        .attr("x", this.width / 2)
        .attr("dx", -5)
        .attr("y", this.height)
        .attr("dy", -5)
        .style("fill-opacity", 0)
        .transition(t)
        .style("fill-opacity", 1)
        .text(d => `n: ${d}`);
    }
  }
}
