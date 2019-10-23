import { Component, AfterViewInit, Input, ViewEncapsulation, ViewChild, ElementRef, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import * as d3 from 'd3';

@Component({
  selector: 'app-allele-hist',
  templateUrl: './allele-hist.component.html',
  styleUrls: ['./allele-hist.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AlleleHistComponent implements AfterViewInit {
  @Input() data: any;
  @ViewChild('allele_hist', { static: false }) private chartContainer: ElementRef;

  // plot sizes
  private element: any;
  private element_dims: any;
  // private margin: any = { top: 10, bottom: 35, left: 75, right: 10 };
  private margin: any = { top: 3, bottom: 3, left: 3, right: 3 };
  private width: number = 570 / 11;
  // private width: number = 100;
  private height: number;
  private spacing: number = 0.2;
  private bar_height: number = 2;

  // --- Selectors ---
  private chart: any; // dotplot

  // --- Scales/Axes ---
  private x: any;
  private y: any;
  private radiusScale: any;
  private colorScale: any;
  private xAxis: any;
  private yAxis: any;

  getSVGDims() {
    // console.log(this.data)
    // Find container; define width/height of svg obj.
    this.element = this.chartContainer.nativeElement;

    // make bars equal height
    this.height = this.data.length * this.bar_height;
  }


  constructor(
    // Whether to be rendered server-side or client-side
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.getSVGDims();
      this.createPlot();
    }
  }

  createPlot() {
    let t = d3.transition().duration(2000);

    this.data.sort((a: any, b: any) => (a.value.total - b.value.total) || (a.key > b.key ? -1 : 1));

    // Append SVG
    const svg = d3.select(this.element)
      .append('svg')
      .attr("class", "dotplot")
      .attr("id", "hla-allele-hist")
      .attr("width", this.width + this.margin.left + this.margin.right)
      .attr("height", this.height + this.margin.top + this.margin.bottom)
      // .style("background", "#E8F6F3");


    // --- x & y axes --
    this.x = d3.scaleLinear()
      .rangeRound([0, this.width])
      .domain([0, <any>d3.max(this.data, (d: any) => d.value.total)]);
    // .domain(this.data.map(d => d.key));

    this.y = d3.scaleBand()
      .rangeRound([this.height, 0])
      .paddingInner(0)
      .paddingOuter(0)
      .domain(this.data.map(d => d.key));

    // this.xAxis = d3.axisBottom(this.x).tickSizeOuter(0);
    this.yAxis = d3.axisLeft(this.y).ticks(5).tickSizeOuter(0);

    // --- Create axes ---
    // svg.append('g')
    //   .attr('class', 'axis axis--x')
    //   .attr('transform', `translate(${this.margin.left}, ${this.height + this.margin.top})`)
    //   .call(this.xAxis);

    svg.append('g')
      .attr('class', 'axis axis--y')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`)
      .call(this.yAxis);

    // selectors
    this.chart = svg.append("g")
      .attr("class", "plot-window")
      .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`);

    // --- Create bars ---
    this.chart.append("g")
      .attr("class", 'hla-hist')
      .selectAll(".hla-hist")
      .data(this.data)
      .enter().append("rect")
      .attr("class", "alleles-hist")
      .attr("id", (d: any) => d.key)
      .attr("x", 0)
      .attr("width", (d: any) => this.x(d.value.total))
      .attr("y", (d: any) => this.y(d.key))
      .attr("height", this.y.bandwidth())
      // .classed("accent", (d: any) => d.value.novel)
  }
}
