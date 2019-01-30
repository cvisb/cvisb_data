import { Component, OnInit, Input, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';

import * as d3 from 'd3';

import { D3Nested } from '../../_models';

@Component({
  selector: 'app-filter-sample-year',
  templateUrl: './filter-sample-year.component.html',
  styleUrls: ['./filter-sample-year.component.scss']
})
export class FilterSampleYearComponent implements OnInit {
  @ViewChild('hist') private chartContainer: ElementRef;

  // data
  @Input() public data: D3Nested[];


  private num_data: Object[]; // numeric portion of the data
  private unknown_data: Object[]; // unknown years


  // plot sizes
  private element: any;
  private element_dims: any;
  private margin: any = { top: 0, bottom: 25, left: 2, right: 2, axisBottom: 3, betweenGraphs: 15 };
  private width: number = 120;
  private min_width_unknown: number = 40;
  private height: number = 90;
  private bar_height: number = 10;
  private bar_spacing: number = 3;

  // --- Selectors ---
  private years: any; // normal histogram
  private unknown: any; // unknown bar

  // --- Scales/Axes ---
  private x: any;
  private x2: any;
  private y: any;
  private colorScale: any;
  private xAxis: any;
  private xAxis2: any;

  constructor() { }

  ngOnInit() {
    if (this.data) {
      this.createPlot();
    }
  }

  prepData() {
    // Split data into numeric + non-numeric data
    this.num_data = this.data.filter((d: any) => typeof (d.key) === 'number');
    this.unknown_data = this.data.filter((d: any) => typeof (d.key) !== 'number');
    this.element = this.chartContainer.nativeElement;
  }

  createPlot() {
    this.prepData();

    // Append SVG
    const svg = d3.select(this.element)
      .append('svg')
      .attr("class", "barplot")
      .attr("width", this.width + this.margin.left + this.margin.right + this.margin.betweenGraphs)
      .attr("height", this.height + this.margin.top + this.margin.bottom);

    // selectors
    this.years = svg.append("g")
      .attr("id", "year_hist")
      .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`);

    this.unknown = svg.append("g")
      .attr("id", "unknown_hist")
      .attr("transform", `translate(${this.margin.left + this.width + this.margin.betweenGraphs}, ${this.margin.top})`);

    // --- x & y axes --
    this.y = d3.scaleLinear()
      .rangeRound([this.height, 0])
      .domain([0, Math.max(d3.max(this.num_data, (d: any) => d.value), d3.max(this.unknown_data, (d: any) => d.value))]).nice();

    this.x = d3.scaleBand()
      .rangeRound([0, this.width])
      .paddingInner(0.2)
      .paddingOuter(0)
      .domain(this.num_data.map((d: any) => d.key));


    let width2 = Math.max(this.x.bandwidth() * 1.25, this.min_width_unknown);

    // rescale svg to proper width
    svg.attr("width", this.width + this.margin.left + this.margin.right + this.margin.betweenGraphs + width2)

    this.x2 = d3.scaleBand()
      .rangeRound([0, width2])
      .paddingInner(0)
      .paddingOuter(0)
      .domain(this.unknown_data.map((d: any) => d.key));

    this.xAxis = d3.axisBottom(this.x).tickSizeOuter(0);
    this.xAxis2 = d3.axisBottom(this.x2).tickSizeOuter(0);

    // --- Create axes ---
    this.years.append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', `translate(0, ${this.height + this.margin.axisBottom})`)
      .call(this.xAxis);

    this.unknown.append('g')
      .attr('class', 'axis axis--x axis--unknown')
      .attr('transform', `translate(0, ${this.height + this.margin.axisBottom})`)
      .call(this.xAxis2);


    // --- Create bars ---
    this.years.append("g")
      .attr("class", 'filter--year')
      .selectAll(".bars")
      .data(this.num_data)
      .enter().append("rect")
      .attr("class", "minirect")
      .attr("id", (d: any) => d.key)
      .attr("x", (d: any) => this.x(d.key))
      .attr("y", (d: any) => this.y(d.value))
      .attr("width", this.x.bandwidth())
      .attr("height", (d: any) => this.y(0) - this.y(d.value));

    this.unknown.append("g")
      .attr("class", 'filter--year unknown')
      .selectAll(".unknown")
      .data(this.unknown_data)
      .enter().append("rect")
      .attr("class", "minirect")
      .attr("id", (d: any) => d.key)
      .attr("x", (d: any) => this.x2(d.key) + (this.x2.bandwidth() - this.x.bandwidth()) / 2)
      .attr("y", (d: any) => this.y(d.value))
      .attr("width", this.x.bandwidth())
      .attr("height", (d: any) => this.y(0) - this.y(d.value));


  }

}
