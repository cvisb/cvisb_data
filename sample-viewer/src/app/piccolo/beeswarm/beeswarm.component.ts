import { Component, AfterViewInit, ViewEncapsulation, ViewChild, ElementRef, Input } from '@angular/core';

import * as d3 from 'd3';

@Component({
  selector: 'app-beeswarm',
  templateUrl: './beeswarm.component.html',
  styleUrls: ['./beeswarm.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class BeeswarmComponent implements AfterViewInit {
  @ViewChild('beeswarm', { static: false }) private chartContainer: ElementRef;
  @Input() data: number[] = [12, 2000, 2000, 98, 45, 2000, 2000, 17, 2000, 52, 31, 392, 2000, 28, 2000, 51, 141, 27, 2000, 88, 1094, 2000, 111, 56, 2000, 2000, 2000, 2000, 1012, 72, 2000, 66, 1891, 2000, 2000, 2000, 2000, 15, 2000, 338, 2000, 2000, 2000, 2000, 1036, 2000, 2000, 2000, 2000, 2000, 159, 125, 46, 30, 35, 2000, 2000, 2000, 41, 2000, 2000, 2000, 2000, 28
  ];

  // --- dimensions ---
  private margin: any = { top: 10, bottom: 15, left: 45, right: 10 };
  private width: number = 450;
  private height: number = 275;
  bandwidth: number = 1.0;

  // --- selectors ---
  private element: any;

  // --- data variables ---
  private x: any;
  private y: any;
  private xAxis: any;
  private yAxis: any;

  constructor() { }

  ngAfterViewInit() {
    console.log(this.data)
    this.createChart();
  }

  createChart() {
    this.element = this.chartContainer.nativeElement;

    let svg = d3.select(this.element)
      .append('svg')
      .attr("class", "barplot")
      .attr("width", this.width + this.margin.left + this.margin.right)
      .attr("height", this.height + this.margin.top + this.margin.bottom)
    // .style("background", "green");

    function kde(kernel, thresholds, data) {
      return thresholds.map(t => [t, d3.mean(data, (d: any) => kernel(t - d))]);
    }

    function epanechnikov(bandwidth) {
      return x => Math.abs(x /= bandwidth) <= 1 ? 0.75 * (1 - x * x) / bandwidth : 0;
    }

    let line = d3.line()
      .curve(d3.curveBasis)
      .x(d => this.x(d[0]))
      .y(d => this.y(d[1]));


    // --- axes ---

    this.x = d3.scaleLinear()
      .domain(d3.extent(this.data)).nice()
      // .base(10)
      .range([this.margin.left, this.width - this.margin.right]);

    console.log(this.x(10))

    let thresholds = this.x.ticks(40);

    let bins = d3.histogram()
      .domain(this.x.domain())
      .thresholds(thresholds)
      (this.data)
    console.log(bins)

    this.y = d3.scaleLinear()
      .domain([0, d3.max(bins, (d: any) => d.length) / this.data.length])
      .range([this.height - this.margin.bottom, this.margin.top]);



    svg.append("g")
      .attr("fill", "#bbb")
      .selectAll("rect")
      .data(bins)
      .enter().append("rect")
      //   .join("rect")
      .attr("x", d => this.x(d.x0) + 1)
      .attr("y", d => this.y(d.length / this.data.length))
      .attr("width", d => this.x(d.x1) - this.x(d.x0) - 1)
      .attr("height", d => this.y(0) - this.y(d.length / this.data.length));


    let density = kde(epanechnikov(this.bandwidth), thresholds, this.data);

    this.xAxis = g => g
      .attr("transform", `translate(0,${this.height - this.margin.bottom})`)
      .call(d3.axisBottom(this.x))
      .call(g => g.append("text")
        .attr("x", this.width - this.margin.right)
        .attr("y", -6)
        .attr("fill", "#000")
        .attr("text-anchor", "end")
        .attr("font-weight", "bold"))
    // .text(this.data.title))

    this.yAxis = g => g
      .attr("transform", `translate(${this.margin.left},0)`)
      .call(d3.axisLeft(this.y).ticks(null, "%"))
      .call(g => g.select(".domain").remove());

    // KDE code based on https://observablehq.com/@d3/kernel-density-estimation

    svg.append("path")
      .datum(density)
      .attr("fill", "none")
      .attr("stroke", "#000")
      .attr("stroke-width", 1.5)
      .attr("stroke-linejoin", "round")
      .attr("d", line);

    svg.append("g")
      .call(this.xAxis);

    svg.append("g")
      .call(this.yAxis);


    let radius = 10;

    // var simulation = d3.forceSimulation(this.data)
    //       .force("x", d3.forceX(function(d) { return this.x(d); }).strength(1))
    //       .force("y", d3.forceY(this.height / 2))
    //       .force("collide", d3.forceCollide(4))
    //       .stop();
    //
    //   // for (var i = 0; i < 120; ++i) simulation.tick();
    //
    //   console.log(simulation)

  //     var cell = svg.append("g")
  //     .attr("class", "cells")
  //   .selectAll("g").data(d3.voronoi()
  //       .extent([[-this.margin.left, -this.margin.top], [this.width + this.margin.right, this.height + this.margin.top]])
  //       .x(function(d) { return d.x; })
  //       .y(function(d) { return d.y; })
  //     .polygons(this.data)).enter().append("g");
  //
  // cell.append("circle")
  //     .attr("r", 3)
  //     .attr("cx", function(d) { return d.data.x; })
  //     .attr("cy", function(d) { return d.data.y; });


    // function tick() {
    //   d3.selectAll('.circ')
    //     .attr('cx', function(d: any) { return d.x })
    //     .attr('cy', function(d: any) { return d.y })
    // }
    //
    //
    //
    // var simulation = d3.forceSimulation(this.data)
    //   .force('x', d3.forceX(function(d) {
    //     return this.x(d)
    //   }).strength(0.99)
    //   )
    //   .force('y', d3.forceY(this.height / 2).strength(0.05))
    //   .force('collide', d3.forceCollide(radius))
    //   .alphaDecay(0)
    //   .alpha(0.12)
    //   .on('tick', tick)
    //
    // var init_decay;
    // init_decay = setTimeout(function() {
    //   console.log('init alpha decay')
    //   simulation.alphaDecay(0.1);
    // }, 8000)
    //
    // simulation.force('x', d3.forceX(function(d) {
    //   return this.x(d)
    // }))
    //
    //
    //
    // simulation
    //   .alphaDecay(0)
    //   .alpha(0.12)
    //   .restart()
    //
    // clearTimeout(init_decay);
    //
    // init_decay = setTimeout(function() {
    //   console.log('init alpha decay');
    //   simulation.alphaDecay(0.1);
    // }, 8000);

    // var cell = svg.append("g")
    //   .attr("class", "cells")
    //   .selectAll("g").data(d3.voronoi()
    //     .extent([[-this.margin.left, -this.margin.top], [this.width + this.margin.right, this.height + this.margin.top]])
    //     .x(function(d) { return d.x; })
    //     .y(function(d) { return d.y; })
    //     .polygons(this.data)).enter().append("g");
    //
    // cell.append("circle")
    //   .attr("r", 3)
    //   .attr("cx", function(d) { return d.data.x; })
    //   .attr("cy", function(d) { return d.data.y; });
  }

  loadData() {

  }

}
