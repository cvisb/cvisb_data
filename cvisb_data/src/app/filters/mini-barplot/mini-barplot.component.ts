import { Component, OnInit, Input, ViewEncapsulation, ViewChild, ElementRef, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import * as d3 from 'd3';

import { StripWhitespacePipe } from '../../_pipes';

@Component({
  selector: 'app-mini-barplot',
  templateUrl: './mini-barplot.component.html',
  styleUrls: ['./mini-barplot.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class MiniBarplotComponent implements OnInit {
  @ViewChild('barplot') private chartContainer: ElementRef;
  @Input() private data: any;
  @Input() private height: number;
  @Input() private spacing: number;
  @Input() private name_var: string;

  // plot sizes
  private element: any;
  private element_dims: any;
  private margin: any = { top: 2, bottom: 2, left: 30, right: 100 };
  private width: number = 70;
  // private height: number = 70;

  // --- Selectors ---
  private chart: any; // dotplot

  // --- Scales/Axes ---
  private x: any;
  private y: any;
  private colorScale: any;
  private yAxis: any;

  getSVGDims() {
    // Find container; define width/height of svg obj.
    this.element = this.chartContainer.nativeElement;

    if (!this.spacing) {
      // space between barplots
      this.spacing = 0.2;
    }
  }


  // constructor() { }
  constructor(private strip: StripWhitespacePipe,
    // Whether to be rendered server-side or client-side
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.getSVGDims();
      this.createPlot();
    }
  }

  createPlot() {
    this.data = this.data.sort((a: any, b: any) => b.value - a.value);

    // Append SVG
    const svg = d3.select(this.element)
      .append('svg')
      .attr("class", "barplot")
      .attr("width", this.width + this.margin.left + this.margin.right)
      .attr("height", this.height + this.margin.top + this.margin.bottom);

    // selectors
    this.chart = svg.append("g")
      .attr("id", "barplot")
      .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`);

    // --- x & y axes --
    this.x = d3.scaleLinear()
      .rangeRound([this.width, 0])
      .domain([0, <any>d3.max(this.data, (d: any) => d.value)]);

    this.y = d3.scaleBand()
      .rangeRound([0, this.height])
      .paddingInner(this.spacing)
      .paddingOuter(0)
      .domain(this.data.map(d => d[this.name_var]));

    this.yAxis = d3.axisRight(this.y);

    // --- Create axes ---
    // svg.append('g')
    //   .attr('class', 'axis axis--y')
    //   .attr('transform', `translate(${this.margin.left + this.width}, ${this.margin.top})`)
    //   .call(this.yAxis);


    // --- Create bars ---
    this.chart.append("g")
      .attr("class", 'bars')
      .selectAll(".bars")
      .data(this.data)
      .enter().append("rect")
      .attr("class", "minirect")
      .attr("id", (d: any) => this.strip.transform(d[this.name_var]))
      .attr("x", (d: any) => this.x(d.value))
      .attr("y", (d: any) => this.y(d[this.name_var]))
      .attr("width", (d: any) => this.x(0) - this.x(d.value))
      .attr("height", this.y.bandwidth());

    // --- Annotate bars ---
    this.chart
      .append("g")
      .attr("class", 'bar--annot')
      .selectAll(".bar--annot")
      .data(this.data)
      .enter().append("text")
      .attr("class", "annotation")
      .attr("id", (d: any) => this.strip.transform(d[this.name_var]))
      .attr("x", (d: any) => this.x(d.value))
      .attr("y", (d: any) => this.y(d[this.name_var]) + this.y.bandwidth() / 2)
      .attr("dx", -4)
      .style("font-size", Math.min(this.y.bandwidth(), 14))
      .text((d: any) => (d.value));


    // Y-label annotations ---
    // Container for the annotation
    let ylabels = this.chart
      .append("g")
      .attr("class", 'y-label')
      .selectAll(".y-label")
      .data(this.data).enter().append("g")
      .attr("id", (d: any) => this.strip.transform(d[this.name_var]));

    // Dummy rectangle, if need to turn into a button
    ylabels.append("rect");

    // Actual label for the annotation
    ylabels.append("text")
      .attr("class", "annotation")
      .attr("x", (d: any) => this.x(0))
      .attr("y", (d: any) => this.y(d[this.name_var]) + this.y.bandwidth() / 2)
      .attr("dx", 6)
      .style("font-size", Math.min(this.y.bandwidth(), 14))
      .text((d: any) => (d[this.name_var]));

    function getTextBox(selection) {
      selection.each(function(d) { d.bbox = this.getBBox(); })
    };

    if (this.name_var === 'type') {
      ylabels.selectAll('text')
        .attr("dx", 10)
        .style("font-size", Math.min(this.y.bandwidth(), 14) * 0.8)
        .call(getTextBox);

      ylabels.insert("rect", "text")
        .attr("class", "rect faux-button")
        .attr("x", function(d) { return d.bbox.x - 4 })
        .attr("y", function(d) { return d.bbox.y - 2 })
        .attr("width", function(d) { return d.bbox.width + 8 })
        .attr("height", function(d) { return d.bbox.height + 4 })
    }
  }

}
