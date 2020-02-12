import { Component, OnInit, OnDestroy, ViewEncapsulation, AfterViewInit } from '@angular/core';

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
  margin = { top: 125, left: 50, right: 15, bottom: 140 };
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

  activateTooltip(selected) {
    d3.select(`#tooltip_${selected.variable}_${selected.term}`)
      .style("display", "block");
  }

  deactivateTooltip() {
    d3.selectAll(".missing-data-tooltip-group")
      .style("display", "none");
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

    let ttips = d3.selectAll("#missing-data-tooltips")
      .selectAll(".missing-data-tooltip-group")
      .data(this.data)
      .enter().append("g")
      .attr("class", "missing-data-tooltip-group")
      .attr("id", variable => 'tooltip_' + variable.variable + '_' + variable.term)
      .attr("display", "none");

    ttips.append("rect")
      .attr("x", variable => this.x(variable.variable))
      .attr("y", variable => this.y(variable.term) + this.rectWidth / 4)
      .attr("height", 58)
      .attr("class", "tooltip-rect");

    ttips.append("line")
      .attr("x1", variable => this.x(variable.variable) + 10)
      .attr("x2", variable => this.x(variable.variable) + 10)
      .attr("y1", variable => this.y(variable.term) + this.rectWidth / 4 + 7)
      .attr("y2", variable => this.y(variable.term) + this.rectWidth / 4 + 55)
      .attr("class", "tooltip-border")
      .attr("stroke", variable => this.colorScale(variable.percent));

    ttips.append("text")
      .attr("y", variable => this.y(variable.term) + this.rectWidth / 4)
      .attr("class", "tooltip-text")
      .append("tspan")
      .attr("dx", "18")
      .attr("dy", "5")
      .attr("x", variable => this.x(variable.variable))
      .text(variable => variable.variable)
      .append("tspan")
      .attr("class", "tooltip-value")
      .attr("dx", "18")
      .attr("dy", "1em")
      .attr("x", variable => this.x(variable.variable))
      .text(variable => d3.format(".0%")(variable.percent) + " missing")
      .append("tspan")
      .style("font-weight", "300")
      .attr("dx", "18")
      .attr("dy", "1em")
      .attr("x", variable => this.x(variable.variable))
      .text(variable => variable.term)


    d3.selectAll('.tooltip-rect')
      .attr("width", (d: any) => (document.getElementById(`tooltip_${d.variable}_${d.term}`) as any).getBBox().width + 18)

  }
}
