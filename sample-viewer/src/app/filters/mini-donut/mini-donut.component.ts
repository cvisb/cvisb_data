import { Component, AfterViewInit, Input, ViewEncapsulation, ViewChild, ElementRef, OnChanges, OnDestroy, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { Subscription } from 'rxjs';
import * as d3 from 'd3';

// Event listeners to update the search query
import { RequestParametersService } from '../../_services';

@Component({
  selector: 'app-mini-donut',
  templateUrl: './mini-donut.component.html',
  styleUrls: ['./mini-donut.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class MiniDonutComponent implements AfterViewInit, OnChanges, OnDestroy {
  @ViewChild('donut') private chartContainer: ElementRef;
  @Input() private data: any;
  @Input() private endpoint: string;
  @Input() private height: number;
  // Expected domain
  @Input() private cohorts: string[];
  @Input() private filterable: boolean = true;
  patientSubscription: Subscription;
  sampleSubscription: Subscription;

  // --- selected cohorts ---
  selectedCohorts: string[];

  // --- plot sizes ---
  private element: any; // selector for SVG DIV
  // @Input() right_margin: number;
  @Input() private margin: any = { top: 2, bottom: 2, left: 2, right: 175 };
  private width: number;
  private hole_frac: number = 0.5;
  private checkboxX: number = 130;

  // --- Selectors ---
  private donut: any; // dotplot
  private svg: any;
  private annotation: any;

  // --- Scales/Axes ---
  private y: any;

  constructor(
    private requestSvc: RequestParametersService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // this.requestSvc.patientParamsState$.subscribe(params => {
    //   console.log(params)
    //   this.selectedCohorts = this.getSelected(params);
    //   console.log(this.selectedCohorts)
    // })
  }

  getSelected(params, fieldName = "cohort") {
    let filtered = params.filter(d => d.field === fieldName);

    if (filtered.length === 1) {
      return (filtered[0].value);
    } else {
      return (this.cohorts);
    }
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.createPlot();

      switch (this.endpoint) {
        case "patient":
          this.patientSubscription = this.requestSvc.patientParamsState$.subscribe(params => {
            this.selectedCohorts = this.getSelected(params);
          })
          break;

        case "sample":
          this.sampleSubscription = this.requestSvc.sampleParamsState$.subscribe(params => {
            this.selectedCohorts = this.getSelected(params);
          })
          break;
      }
    }
  }


  ngOnChanges() {
    this.updatePlot();
  }

  ngOnDestroy() {
    if (this.patientSubscription) {
      this.patientSubscription.unsubscribe();
    }
    if (this.sampleSubscription) {
      this.sampleSubscription.unsubscribe();
    }
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
      .paddingOuter(0);

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
      let keys = this.data.map(d => d.term);

      // If there are no bulk values, set to the keys.
      if (!this.cohorts || this.cohorts.length === 0) {
        this.cohorts = keys;
      } else {
        let missing_data = this.cohorts.filter(d => !keys.includes(d));
        missing_data.forEach(d => {
          this.data.push({ term: d, count: 0 });
        })
      }
      // if selectedCohorts doesn't exist, set to the cohorts.
      if (!this.selectedCohorts) {
        this.selectedCohorts = this.cohorts;
      }
      this.data.forEach(d => {
        d['selected'] = this.selectedCohorts.includes(d.term) ? true : false;
      })

      // --- Update axes ---
      this.y
        .domain(this.cohorts);

      // --- Filter event listener ---
      // Handle into filtering by virus type
      // let filterCohort = function(endpoint: string, requestSvc: any) {
      //   return function(d) {
      //     requestSvc.updateParams(endpoint, { field: 'cohort', value: d.data.term })
      //   }
      // }

      // Handle into filtering by virus type
      let filterCheckbox = function(endpoint: string, requestSvc: any, data) {
        return function(selected) {
          // reverse the selection
          let idx = data.findIndex(d => d.term == selected.term);
          if (idx > -1) {
            data[idx]['selected'] = !selected.selected;
          }

          // flip the checkbox path on/off
          // d3.selectAll(".checkmark").style("display", (d: any) => d.selected ? "block" : "none");
          d3.selectAll(".checkmark")
            .text((d: any) => d.selected ? "\uf14a" : "\uf0c8")
            .classed("checked", (d: any) => d.selected);

          let cohorts = data.filter(d => d.selected).map(d => d.term);
          requestSvc.updateParams(endpoint, { field: 'cohort', value: cohorts })
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
        .value((d: any) => d.count);

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
        .attr("class", d => d.data.term)
        .style("stroke-opacity", 1)
        .transition(t)
        .attr("d", arc)
        .style("stroke-opacity", d => d.value > 0 ? 1 : 0)
        .attrTween("d", arcTween);

      // Add in tooltip/filtering behavior
      // this.svg.selectAll("path")
      //   .on("click", filterCohort(this.endpoint, this.requestSvc));

      // --- Annotate donut ---
      // Group update/merge: https://stackoverflow.com/questions/41625978/d3-v4-update-pattern-for-groups
      // --- selectors ---
      var annotation_group = this.annotation.selectAll(".annotation--group")
        .data(this.data, function(d) {
          return d.term;
        });
      let checkmarks = annotation_group.select(".checkmark");

      // --- exit ---
      annotation_group.exit().remove(); // exit, remove the text

      // --- enter ---
      let annotationGroupEnter = annotation_group.enter() // enter the text
        .append("g")
        .attr("class", "annotation--group");

      let textEnter = annotationGroupEnter.append("text") // enter the first tspan on the text element
        .attr("x", 0)
        .attr("dx", 15)
        .attr('class', 'annotation--count');

      // --- update/merge ---
      annotation_group = annotationGroupEnter
        .merge(annotation_group)
        .attr("id", (d: any) => `${d.term}`); // enter + update

      // Update the position, class, and text for the count per thing.
      annotation_group.select(".annotation--count")
        .attr("class", (d: any) => `${d.term} annotation--count`)
        .style("font-size", Math.min(this.y.bandwidth(), 14))
        .attr("y", (d: any) => this.y(d.term) + this.y.bandwidth() / 2)
        .classed('disabled', (d: any) => d.count === 0)
        .text((d: any) => `${d.term}: ${d3.format(",")(d.count)}`);

      if (this.filterable) {
        let checkmarkEnter = annotationGroupEnter
          .append("text")
          .attr("x", (d: any) => this.checkboxX)
          .attr("class", "checkmark");

        checkmarks.merge(checkmarkEnter)
          .attr("class", (d: any) => `checkmark ${d.term}`)
          .attr("y", (d: any) => this.y(d.term) + this.y.bandwidth() / 2)
          .text(d => d.selected ? "\uf14a" : "\uf0c8")
          .classed("checked", (d: any) => d.selected);

        // --- click listener ---
        this.svg.selectAll(".checkmark")
          .on("click", filterCheckbox(this.endpoint, this.requestSvc, this.data));
      }
    }
  }

}
