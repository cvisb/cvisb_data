import { Component, AfterViewInit, Input, ViewEncapsulation, ViewChild, ElementRef, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import * as d3 from 'd3';

@Component({
  selector: 'app-allele-count',
  templateUrl: './allele-count.component.html',
  styleUrls: ['./allele-count.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AlleleCountComponent implements AfterViewInit {
  @Input() data: any;
  @ViewChild('allele_count', { static: false }) private chartContainer: ElementRef;

  // plot sizes
  private element: any;
  private element_dims: any;
  private margin: any = { top: 10, bottom: 35, left: 25, right: 10 };
  private width: number = 570;
  private height: number = 270;
  private spacing: number = 0.2;
  private radius_min: number = 4;
  private radius_max: number = 10;

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
    // Find container; define width/height of svg obj.
    this.element = this.chartContainer.nativeElement;
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

    this.data.sort((a: any, b: any) => (b.count - a.count) || (a.key < b.key ? -1 : 1));

    // Append SVG
    const svg = d3.select(this.element)
      .append('svg')
      .attr("class", "dotplot")
      .attr("id", "hla-allele-count")
      .attr("width", this.width + this.margin.left + this.margin.right)
      .attr("height", this.height + this.margin.top + this.margin.bottom);


    // --- x & y axes --
    this.x = d3.scalePoint()
      .rangeRound([0, this.width])
      .padding(0.25)
      .domain(this.data.map(d => d.key));

    this.y = d3.scaleLinear()
      .rangeRound([this.height, 0])
      .domain([0, <any>d3.max(this.data, (d: any) => d.count)]);

    this.colorScale =
      d3.scaleLinear()
        .range(<any>["rgb(230,236,246)", "rgb(66,119,181)"])
        .domain([0, <any>d3.max(this.data, (d: any) => d.count)]);

    // this.radiusScale = d3.scaleLinear()
    //   .range([this.radius_min, this.radius_max])
    //   .domain([<any>d3.min(this.data, (d: any) => d.count), <any>d3.max(this.data, (d: any) => d.count)]);

    this.xAxis = d3.axisBottom(this.x).tickSizeOuter(0);
    this.yAxis = d3.axisLeft(this.y).ticks(5).tickSizeOuter(0);

    // --- Create axes ---
    svg.append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', `translate(${this.margin.left}, ${this.height + this.margin.top})`)
      .call(this.xAxis);

    svg.append('g')
      .attr('class', 'axis axis--y')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`)
      .call(this.yAxis);

    // selectors
    this.chart = svg.append("g")
      .attr("class", "plot-window")
      .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`);


    // --- Create lollis ---
    this.chart.append("g")
      .attr("class", 'lollipop')
      .selectAll(".lollipop line")
      .data(this.data)
      .enter().append("line")
      .attr("class", "lollipop--alleles")
      .attr("id", (d: any) => d.key)
      .attr("x1", (d: any) => this.x(d.key))
      .attr("x2", (d: any) => this.x(d.key))
      .attr("y1", this.y(0))
      .attr("y2", this.y(0))
      .transition(t)
      .attr("y2", (d: any) => this.y(d.count));

    // --- Create dots ---
    this.chart.append("g")
      .attr("class", 'dots')
      .selectAll(".dots")
      .data(this.data)
      .enter().append("circle")
      .attr("class", "dots--allele-count")
      .attr("id", (d: any) => d.key)
      .attr("cx", (d: any) => this.x(d.key))
      .attr("r", (this.radius_max + this.radius_min)/2)
      // .attr("r", (d: any) => this.radiusScale(d.count))
      .attr("cy", this.y(0))
      .attr("fill", "white")
      .transition(t)
      .attr("cy", (d: any) => this.y(d.count))
      .attr("fill", (d: any) => this.colorScale(d.count));
  }

}
