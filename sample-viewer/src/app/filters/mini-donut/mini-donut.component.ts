import { Component, OnInit, Input, ViewEncapsulation, ViewChild, ElementRef, OnChanges } from '@angular/core';

import * as d3 from 'd3';

// Event listeners to update the search query
import { RequestParametersService } from '../../_services';

@Component({
  selector: 'app-mini-donut',
  templateUrl: './mini-donut.component.html',
  styleUrls: ['./mini-donut.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class MiniDonutComponent implements OnInit {

  @ViewChild('donut') private chartContainer: ElementRef;
  @Input() private data: any;
  @Input() private endpoint: string;
  @Input() private height: number;
  @Input() private name_var: string;

  // Expected values
  @Input() private cohorts: string[];

  // plot sizes
  private element: any; // selector for SVG DIV
  private element_dims: any;
  private margin: any = { top: 2, bottom: 2, left: 2, right: 125 };
  private width: number;
  private hole_frac: number = 0.5;
  private bar_height: number = 10;
  private bar_spacing: number = 3;

  // --- Selectors ---
  private donut: any; // dotplot
  private svg: any;
  private annotation: any;

  // --- Scales/Axes ---
  private y: any;

  constructor(private requestSvc: RequestParametersService) { }

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


    // Axis labels
    this.y = d3.scaleBand()
      .rangeRound([0, this.height])
      .paddingInner(0.2)
      .paddingOuter(0)
      .domain(this.cohorts);

    // selectors
    this.donut = this.svg.append("g")
      .attr("id", "donut")
      .attr("transform", `translate(${this.margin.left + this.width / 2}, ${this.height / 2 + this.margin.top})`);

    this.annotation = this.svg.append("g")
      .attr("class", 'donut--annot')
      .attr('transform', `translate(${this.margin.left + this.width}, ${this.margin.top})`);


    // Initial call to update / populate with data
    this.updatePlot();
  }

  updatePlot() {
    if (this.data && this.donut) {
      // --- Merge in null values ---
      // update the data to add in missing values.
      // Essential for object constancy.
      let keys = this.data.map(d => d.key);

      let missing_data = this.cohorts.filter(d => !keys.includes(d));
      missing_data.forEach(d => {
        this.data.push({ key: d, value: 0 });
      })

      // --- Filter event listener ---
      // Handle into filtering by virus type
      let filterCohort = function(endpoint: string, requestSvc: any) {
        return function(d) {
          requestSvc.updateParams(endpoint, { field: 'cohort', value: d.data.key })
        }
      }

      // Handle into filtering by virus type
      let filterText = function(endpoint: string, requestSvc: any) {
        // TODO: flip on/off.
        return function(d) {
          console.log('filtering ' + d.key)
          // If the parameter is already turned on, turn it off.
          let isExcluded = d.value != 0;
          requestSvc.updateParams(endpoint, { field: 'cohort', value: d.key, exclude: isExcluded })
        }
      }

      let mouseoverText = function() {
        return function(d) {
          // Turn off disabled class for text
          d3.select(this).selectAll(".annotation--count")
            .classed('disabled', false);

          // Turn on X or + icon next to the text
          d3.select(this).selectAll(".annotation--tooltip")
            .style("display", "inline-block");
        }
      }

      let mouseoutText = function() {
        return function(d) {
          d3.select(this).selectAll(".annotation--count")
            .classed('disabled', (d: any) => d.value === 0);

          // turn off tooltip
          d3.select(this).selectAll(".annotation--tooltip")
            .style("display", "none");
        }
      }

      // --- transitions ----
      var t = d3.transition()
        .duration(1000);

      // from https://bl.ocks.org/mbostock/1346410
      // https://bl.ocks.org/mbostock/5681842
      let arcTween = function(a) {
        var i = d3.interpolate(this._current, a);
        this._current = i(0);
        return function(t) {
          return arc(i(t));
        };
      }

      // --- Donut calculators ---
      // Donut chart
      var pie: any = d3.pie()
        // .sort((a: any, b: any) => a.value > b.value ? -1 : 1)
        .sort(null) // remove sorting so there's constancy b/w the slices
        .value((d: any) => d.value);

      let arc = d3.arc()
        .innerRadius(this.height / 2 * this.hole_frac)
        .outerRadius(this.height / 2 - 1);

      const arcs = pie(this.data);

      // --- Create donut paths ---
      let donut_path = this.donut.selectAll("path")
        .data(arcs);

      donut_path.exit()
        .transition(t)
        .style("fill-opacity", 1e-6)
        .remove();

      donut_path.enter().append("path")
        .each(function(d) { this._current = d; })
        .merge(donut_path)
        .attr("class", d => d.data.key)
        .style("stroke-opacity", 1)
        .transition(t)
        .attr("d", arc)
        .style("stroke-opacity", d => d.value > 0 ? 1 : 0)
        .attrTween("d", arcTween);
      // .transition()
      // .duration(50)
      // .style("stroke-opacity", 0)
      // .transition(t)
      // .attr("d", arc)
      // .attrTween("d", arcTween)
      // .transition()
      // .duration(50)
      // .style("stroke-opacity", 1);

      // Add in tooltip/filtering behavior
      this.svg.selectAll("path")
        .on("click", filterCohort(this.endpoint, this.requestSvc));

      // --- Annotate donut ---
      // Group update/merge: https://stackoverflow.com/questions/41625978/d3-v4-update-pattern-for-groups
      var node = this.annotation.selectAll(".annotation--group")
        .data(this.data, function(d) {
          return d.key;
        });

      node.exit().remove(); // exit, remove the text

      let nodeEnter = node.enter() // enter the text
        .append("text")
        .attr("class", "annotation--group");

      nodeEnter.append("tspan") // enter the first tspan on the text element
        .attr("x", 0)
        .attr("dx", 15)
        .attr('class', 'annotation--count');

      nodeEnter.append("tspan") // enter the tspan tooltip on the text element
        .attr("class", 'annotation--tooltip')
        .style("display", "none")
        .attr("dx", 15);

      node = nodeEnter.merge(node); // enter + update

      // Update the position, class, and text for the count per thing.
      node.select(".annotation--count")
        .attr("class", (d: any) => `${d.key} annotation--count`)
        .style("font-size", Math.min(this.y.bandwidth(), 14))
        .attr("y", (d: any) => this.y(d.key) + this.y.bandwidth() / 2)
        .classed('disabled', (d: any) => d.value === 0)
        .text((d: any) => `${d.key}: ${d.value}`);

      // Update the position, class, and text for the count per thing.
      node.select(".annotation--tooltip")
        .style("font-size", Math.min(this.y.bandwidth(), 14))
        .attr("class", (d: any) => d.value > 0 ? 'far filter-data annotation--tooltip' : 'fas add-data annotation--tooltip')
        .attr("y", (d: any) => this.y(d.key) + this.y.bandwidth() / 2)
        .text((d: any) => {
          if (d.value > 0) {
            // Delete/filter
            return (`\uf057`);
          }
          // Add mark
          return (`\uf0fe`);
        });

      // Add in tooltip/filtering behavior
      this.svg.selectAll(".annotation--count")
        .on("click", filterText(this.endpoint, this.requestSvc));

      this.svg.selectAll(".annotation--group")
        .on("mouseover", mouseoverText())
        .on("mouseout", mouseoutText());

    }
  }

}
