import { Component, OnInit, Input, ViewEncapsulation, ViewChild, ElementRef, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import * as d3 from 'd3';

@Component({
  selector: 'app-novel-alleles',
  templateUrl: './novel-alleles.component.html',
  styleUrls: ['./novel-alleles.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NovelAllelesComponent implements OnInit {
  @Input() data: any;
  @ViewChild('new_alleles_plot') private chartContainer: ElementRef;

  // plot sizes
  private element: any;
  private element_dims: any;
  private margin: any = { top: 10, bottom: 35, left: 25, right: 10 };
  private width: number = 570;
  private height: number = 270;
  private spacing: number = 0.2;
  private radius_min: number = 4;
  private radius_max: number = 10;
  private legend_vals: number[];

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

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.getSVGDims();
      this.createPlot();
    }
  }

  createPlot() {
    let t = d3.transition().duration(2000);

    this.data.sort((a: any, b: any) => b.value.unique_total - a.value.unique_total || b.value.total - a.value.total);
    this.data.sort((a: any, b: any) => b.value.total - a.value.total || b.value.unique_total - a.value.unique_total);

    // Append SVG
    d3.select(this.element)
      .append('svg')
      .attr("class", "legend")
      .attr("id", "hla-novel-alleles")
      .attr("width", this.width + this.margin.left + this.margin.right)
      .attr("height", this.radius_max + 65)
      // .style("background", '#CCC');

    const legend = d3.select(".legend")
      .append("g")
      .attr('transform', `translate(170,5)`);


    const svg = d3.select(this.element)
      .append('svg')
      .attr("class", "dotplot")
      .attr("id", "hla-novel-alleles")
      .attr("width", this.width + this.margin.left + this.margin.right)
      .attr("height", this.height + this.margin.top + this.margin.bottom);



    // --- x & y axes --
    this.x = d3.scalePoint()
      .rangeRound([0, this.width])
      .padding(0.25)
      .domain(this.data.map(d => d.key));

    this.y = d3.scaleLinear()
      .rangeRound([this.height, 0])
      .domain([0, <any>d3.max(this.data, (d: any) => d.value.total)]);

    let dataMin = <any>d3.min(this.data, (d: any) => d.value.unique_total);
    let dataMax = <any>d3.max(this.data, (d: any) => d.value.unique_total);

    this.colorScale =
      d3.scaleLinear()
        .range(<any>["rgb(230,236,246)", "rgb(66,119,181)"])
        .domain([0, dataMax]);

    this.radiusScale = d3.scaleSqrt()
      .range([this.radius_min, this.radius_max])
      .domain(<any>d3.extent(this.data, (d: any) => d.value.unique_total));

    this.legend_vals = [dataMin, Math.floor((dataMin + dataMax) / 2), dataMax];

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
      .attr("y2", (d: any) => this.y(d.value.total));

    // --- Create dots ---
    this.chart.append("g")
      .attr("class", 'dots')
      .selectAll(".dots")
      .data(this.data)
      .enter().append("circle")
      .attr("class", "dots--alleles")
      .attr("id", (d: any) => d.key)
      .attr("cx", (d: any) => this.x(d.key))
      .attr("r", (d: any) => this.radiusScale(d.value.unique_total))
      .attr("cy", this.y(0))
      .attr("fill", "white")
      .transition(t)
      .attr("cy", (d: any) => this.y(d.value.total))
      .attr("fill", (d: any) => this.colorScale(d.value.unique_total));

    legend.selectAll(".dots--legend")
      .data(this.legend_vals)
      .enter().append("circle")
      .attr("class", "dots--legend")
      .attr("cx", (d: any, i: number) => i * 25 + this.radiusScale(d) + 10)
      .attr("r", (d: any) => this.radiusScale(d))
      .attr("cy", this.radius_max + 33)
      .attr("fill", (d: any) => this.colorScale(d));

    legend.append("line")
      .attr("class", "lollipop--legend lollipop")
      .attr("x1", 3)
      .attr("x2", 70)
      .attr("y1", (25 + this.radius_max) / 2 -4)
      .attr("y2", (25 + this.radius_max) / 2 - 4);

    legend.append("circle")
      .attr("class", "lollipop-circle--legend lollipop")
      .attr("cx", 70)
      .attr("cy", (25 + this.radius_max) / 2 - 4)
      .attr("r", 5)
      .style("fill", "white");

    legend.selectAll(".annotation--legend")
      .data(this.legend_vals)
      .enter().append("text")
      .attr("class", "annotation--legend")
      .attr("x", (d: any, i: number) => i * 25 + this.radiusScale(d) + 10)
      .text((d: any) => d)
      .attr("y", this.radius_max * 2 + 48)

    legend.append("text")
      .attr("class", "annotation--label")
      .attr("x", 100)
      .text("unique novel alleles per locus")
      .attr("y", (25 + this.radius_max) / 2 + 30)

    legend.append("text")
      .attr("class", "annotation--label")
      .attr("x", 100)
      .text("patients with novel alleles per locus")
      .attr("y", (25 + this.radius_max) / 2)
  }

}
