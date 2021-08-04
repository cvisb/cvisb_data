import { Component, AfterViewInit, Input, ViewEncapsulation, ViewChild, ElementRef, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import * as d3 from 'd3';


@Component({
  selector: 'app-dot-plot',
  templateUrl: './dot-plot.component.html',
  styleUrls: ['./dot-plot.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DotPlotComponent implements AfterViewInit {
  @ViewChild('dotplot') private chartContainer: ElementRef;
  @Input() private data: any;

  // plot sizes
  private element: any;
  private margin: any = { top: 0, bottom: 2, left: 120, right: 8 };
  private width: number = 50;
  private height: number;
  private ySpacing: number = 0.5;
  private yHeight: number = 16; // manually determined, based on a 100px map of SLE and 6 countries in yDomain.
  // private yHeight: number = 10.6; // manually determined, based on a 100px map of SLE and 6 countries in yDomain.

  // --- Selectors ---
  private svg: any; // svg container
  private chart: any; // dotplot
  private background: any;

  // --- Scales/Axes ---
  private x: any;
  private y: any;
  private ySelector: any;
  private yAxis: any;
  private colorScale: any;

  constructor(
    // Whether to be rendered server-side or client-side
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.createPlot();
    }
  }

  ngOnChanges() {
    this.updatePlot();
  }

  createPlot() {
    this.element = this.chartContainer.nativeElement;

    // Append SVG
    this.svg = d3.select(this.element)
      .append('svg')
      .attr("class", "dot-plot")
      .attr("width", this.width + this.margin.left + this.margin.right);
    // .style("background", "#98AED4");

    // selectors
    this.chart = this.svg.append("g")
      .attr("id", "dotplot")
      .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`);

    // colored background
    this.background = this.chart.append("rect")
      .attr("class", "chart-background");


    // --- x & y axes --
    this.x = d3.scaleLinear()
      .rangeRound([0, this.width]);

    this.y = d3.scaleBand()
      .paddingInner(this.ySpacing)
      .paddingOuter(0);

    this.ySelector = this.svg.append('g')
      .attr('class', 'dotplot-axis axis--y')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);

    // --- color scale ---
    this.colorScale = d3.scaleSequential(d3.interpolateYlGnBu);

    this.updatePlot();
  }

  updatePlot() {
    if (this.data && this.svg) {
      var t = d3.transition()
        .duration(1000);

      this.data = this.data.sort((a: any, b: any) => b.count - a.count);

      // --- update axes ---
      this.height = this.data.length * this.yHeight;


      this.svg.attr("height", this.height + this.margin.top + this.margin.bottom);

      this.x.domain([0, <any>d3.max(this.data, (d: any) => d.count)]);

      this.y
        .rangeRound([0, this.height])
        .domain(this.data.map((d: any) => d.name));

      this.colorScale.domain([0, d3.max(this.data.map(d => d.count))]);

      this.yAxis = d3.axisLeft(this.y);

      this.ySelector
        .call(this.yAxis);

      // --- Update background ---
      this.background
        .attr("x", -this.y.bandwidth())
        .attr("y", -this.y.bandwidth())
        .attr("width", this.width + this.y.bandwidth() * 2)
        .attr("height", this.height + this.y.bandwidth() * 2);

      this.chart.append("line")
        .attr("class", "x-axis")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", 0)
        .attr("y2", this.height);

      // --- Create dots / lollipops ---
      // --- selectors ---
      let dotGroup = this.chart
        .selectAll(".dot-group")
        .data(this.data);

      let dots = dotGroup.select(".dot");
      let lollipops = dotGroup.select(".lollipop-stick");

      // --- exit ---
      dotGroup.exit()
        .remove();

      // --- enter ---
      let dotGroupEnter = dotGroup.enter() // enter the text
        .append("g")
        .attr("class", "dot-group");


      let lollipopEnter = dotGroupEnter.append("line") // enter the first tspan on the text element
        .attr('class', 'lollipop-stick')
        .attr("x1", 0);

      let dotEnter = dotGroupEnter.append("circle") // enter the first tspan on the text element
        .attr('class', 'dot dot--count')
        .attr("r", this.y.bandwidth() / 2);



      // --- update/merge ---
      dotGroup = dotGroupEnter
        .merge(dotGroup)
        .attr("id", (d: any) => `${d.name}`); // enter + update

      // Update the position, class, and properties for the count per thing.
      dots.merge(dotEnter)
        .attr("cy", (d: any) => this.y(d.name) + this.y.bandwidth() / 2)
        .attr("cx", 0)
        .transition(t)
        .style("fill", (d: any) => this.colorScale(d.count))
        .attr("cx", (d: any) => this.x(d.count));

      dots.merge(lollipopEnter)
        .attr("y1", (d: any) => this.y(d.name) + this.y.bandwidth() / 2)
        .attr("y2", (d: any) => this.y(d.name) + this.y.bandwidth() / 2)
        .transition(t)
        .attr("x2", (d: any) => this.x(d.count));
    }
  }

}
