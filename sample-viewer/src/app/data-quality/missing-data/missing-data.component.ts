import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';

import { interpolateInferno } from 'd3-scale-chromatic';
import * as d3 from 'd3';

import { DataQualityService } from '../../_services/';
import { MissingData } from '../../_models';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-missing-data',
  templateUrl: './missing-data.component.html',
  styleUrls: ['./missing-data.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class MissingDataComponent implements OnInit, OnDestroy {
  // --- data ---
  data: MissingData[] = [];
  dataSubscription: Subscription;

  // --- plot dimensions ---
  width: number = 1000;
  height: number = 200;
  legendWidth: number = 100;
  legendHeight: number = 15;
  margin: Object = { top: 125, left: 50, right: 15, bottom: 40 };
  rectWidth: number = 25;

  // --- axes ---
  x: any;
  y: any;
  colorScale: any = d3.scaleSequential(interpolateInferno)
    .domain([1, 0]);
  xAxis: any;
  yAxis: any;

  constructor(private dataSvc: DataQualityService) { }

  ngOnInit() {
    this.dataSubscription = this.dataSvc.getMissing().subscribe(data => {
      this.data = data;
      this.drawChart();
    });
  }

  ngOnDestroy() {
    this.dataSubscription.unsubscribe();
  }

  drawChart() {
    // --- sort data ---
    let varAvgs = d3.nest()
      .key(d => d['variable'])
      .rollup(values => d3.mean(values, (d: any) => d['percent'] * d['total']) as any)
      .entries(this.data)
      .sort((a: any, b: any) => b.value - a.value);

    let sourceAvgs = d3.nest()
      .key(d => d['term'])
      .rollup(values => d3.mean(values, (d: any) => d['percent'] * d['total']) as any)
      .entries(this.data);

    let variables = varAvgs.map(d => d.key);
    let sources = sourceAvgs.map(d => d.key);

    // --- update / create axes ---
    this.width = variables.length * this.rectWidth;
    this.height = sources.length * this.rectWidth;

    this.x = d3.scaleBand()
      .range([0, this.width])
      .domain(variables);

    this.y = d3.scaleBand()
      .range([0, this.height])
      .domain(sources);

    // --- call axes ---
    this.xAxis = d3.axisTop(this.x);
    this.yAxis = d3.axisLeft(this.y);

    d3.select("svg")
      .append("g")
      .attr("id", "AXIS")


    d3.select("#x-axis").call(this.xAxis)
      .selectAll("text")
      .attr("y", 0)
      .attr("x", 0)
      .attr("dx", "1.25em")
      .attr("dy", "-0.25em")
      .attr("transform", "rotate(-60)")
      .style("text-anchor", "start");

    d3.select("#y-axis").call(this.yAxis);
  }



}
