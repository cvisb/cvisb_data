import { Component, OnInit, Input, ViewEncapsulation, ViewChild, ElementRef, OnChanges } from '@angular/core';

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
  private svg: any;

  // --- Scales/Axes ---
  private y: any;
  private colorScale: any;

  constructor() { }

  ngOnInit() {
    this.createPlot();
  }


  ngOnChanges() {
    this.updatePlot();
  }

  createPlot() {
    this.element = this.chartContainer.nativeElement;
    this.width = this.height;

    // Append SVG
    this.svg = d3.select(this.element)
      .append('svg')
      .attr("class", "donut")
      .attr("width", this.width + this.margin.left + this.margin.right)
      .attr("height", this.height + this.margin.top + this.margin.bottom);

    // selectors
    this.donut = this.svg.append("g")
      .attr("id", "donut")
      .attr("transform", `translate(${this.margin.left + this.width / 2}, ${this.height / 2 + this.margin.top})`);

    // Initial call to update / populate with data
    this.updatePlot();
  }

  updatePlot() {
    if (this.data && this.donut) {
      console.log('updating data')
      console.log(this.data)
      // Handle in to filter the virus type

      let filterSlice = function() {
        return function(d) {
          console.log(d);
        }
      }

      // transition
      var t = d3.transition()
        .duration(5000);

      // Axis labels
      this.y = d3.scaleBand()
        .rangeRound([0, this.height])
        .paddingInner(0.2)
        .paddingOuter(0)
        .domain(this.data.map(d => d.key));

      // Donut chart
      var pie: any = d3.pie()
        .sort((a: any, b: any) => a.value > b.value ? -1 : 1)
        .value((d: any) => d.value);

      let arc = d3.arc().innerRadius(this.height / 2 * this.hole_frac).outerRadius(this.height / 2 - 1);

      const arcs = pie(this.data);

      let donut_path = this.donut.selectAll("path")
        .data(arcs);

      donut_path.exit()
        .transition(t)
        .style("fill-opacity", 1e-6)
        .remove();

      donut_path.enter().append("path")
        .attr("class", d => d.data.key)
        .merge(donut_path)
        .transition(t)
        .attr("d", arc)

      donut_path.selectAll("path")
      .on("mouseover", filterSlice);

      // --- Annotate donut ---
      let labels = this.svg.append("g")
        .attr("class", 'donut--annot')
        .attr('transform', `translate(${this.margin.left + this.width}, ${this.margin.top})`)
        .selectAll(".donut--annot")
        .data(this.data);

      labels.exit()
        .transition(t)
        .style("fill-opacity", 1e-6)
        .remove();

      labels.enter().append("text")
        .merge(labels)
        .attr("class", (d: any) => d.key)
        .attr("x", 0)
        .attr("dx", 15)
        .attr("y", (d: any) => this.y(d.key) + this.y.bandwidth() / 2)
        .style("font-size", Math.min(this.y.bandwidth(), 14))
        .style("fill-opacity", 0)
        .transition(t)
        .style("fill-opacity", 1)
        .text((d: any) => `${d.key}: ${d.value}`);
    }
  }

}
