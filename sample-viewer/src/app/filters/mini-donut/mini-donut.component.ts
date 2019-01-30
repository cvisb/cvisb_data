import { Component, OnInit, Input, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';

import * as d3 from 'd3';

@Component({
  selector: 'app-mini-donut',
  templateUrl: './mini-donut.component.html',
  styleUrls: ['./mini-donut.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MiniDonutComponent implements OnInit {

  @ViewChild('donut') private chartContainer: ElementRef;
  @Input() private data: any;
  @Input() private height: number;
  @Input() private name_var: string;

  // plot sizes
  private element: any; // selector for SVG DIV
  private element_dims: any;
  private margin: any = { top: 2, bottom: 2, left: 2, right: 100 };
  private width: number;
  private hole_frac: number = 0.5;
  private bar_height: number = 10;
  private bar_spacing: number = 3;

  // --- Selectors ---
  private donut: any; // dotplot

  // --- Scales/Axes ---
  private y: any;
  private colorScale: any;

  constructor() { }

  ngOnInit() {
    this.createPlot();
  }

  createPlot() {
    this.element = this.chartContainer.nativeElement;
    this.width = this.height;

    // Append SVG
    const svg = d3.select(this.element)
      .append('svg')
      .attr("class", "donut")
      .attr("width", this.width + this.margin.left + this.margin.right)
      .attr("height", this.height + this.margin.top + this.margin.bottom);


// Axis labels
    this.y = d3.scaleBand()
      .rangeRound([0, this.height])
      .paddingInner(0.2)
      .paddingOuter(0)
      .domain(this.data.map(d => d.key));

    // selectors
    this.donut = svg.append("g")
      .attr("id", "donut")
      .attr("transform", `translate(${this.margin.left + this.width / 2}, ${this.height / 2 + this.margin.top})`);


    // Donut chart
    var pie: any = d3.pie()
      .sort((a: any, b: any) => a.value > b.value ? -1 : 1)
      .value((d: any) => d.value);

    let arc = d3.arc().innerRadius(this.height / 2 * this.hole_frac).outerRadius(this.height / 2 - 1);


    const arcs = pie(this.data);

    this.donut.selectAll("path")
      .data(arcs)
      .enter().append("path")
      .attr("class", d => d.data.key)
      .attr("d", arc)

    // --- Annotate donut ---
    svg
      .append("g")
      .attr("class", 'donut--annot')
      .attr('transform', `translate(${this.margin.left + this.width}, ${this.margin.top})`)
      .selectAll(".donut--annot")
      .data(this.data)
      .enter().append("text")
      .attr("class", (d: any) => d.key)
      .attr("x", 0)
      .attr("dx", 15)
      .attr("y", (d: any) => this.y(d.key) + this.y.bandwidth() / 2)
      .style("font-size", Math.min(this.y.bandwidth(), 14))
      .text((d: any) => `${d.key}: ${d.value}` );

  }


}
