import { Component, OnInit, OnChanges, AfterViewInit, Input, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';

import * as d3 from 'd3';

import { Observable, Subject, BehaviorSubject, throwError } from 'rxjs';

import { RequestParametersService } from '../../_services';
import { D3Nested, RequestParam, RequestParamArray } from '../../_models';

@Component({
  selector: 'app-filterable-histogram',
  templateUrl: './filterable-histogram.component.html',
  styleUrls: ['./filterable-histogram.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class FilterableHistogramComponent implements OnInit {
  @ViewChild('hist') private chartContainer: ElementRef;

  // data
  @Input() public data: D3Nested[];
  @Input() public xDomain: number[];
  @Input() public endpoint: string;
  @Input() public filter_title: string;


  private num_data: Object[]; // numeric portion of the data
  private unknown_data: Object[]; // unknown years


  // plot sizes
  private element: any;
  private element_dims: any;
  private margin: any = { top: 0, bottom: 25, left: 12, right: 12, axisBottom: 3, betweenGraphs: 15 };
  private width: number = 150;
  private min_width_unknown: number = 40;
  private height: number = 90;
  private slider_height: number = 50;
  private bar_height: number = 10;
  private bar_spacing: number = 3;

  // --- Selectors ---
  private years: any; // normal histogram
  private year_rects: any; // normal histogram bars
  private unknown: any; // unknown graph
  private unknown_rects: any; // unknown bar
  private svg: any;
  private svg_slider: any;
  private slider: any;
  private handle_left: any;
  private handle_right: any;


  // --- Scales/Axes ---
  private x: any;
  private x2: any;
  private xLinear: any;
  private y: any;
  private colorScale: any;
  private xAxis: any;
  private xAxis2: any;
  private axisHist: any;

  // --- Constants ---
  handle_path: string = "M4.1,11V-1L0.5-5.5L-3.1-1v12H4.1z";
  innerPadding: number = 0.2;
  outerPadding: number = 0.2;

  // Event listener for filter limits
  private sendParams: any;
  // private yearField: string = "infectionYear"; // field name in ES to filter the sample year.
  yearLimits: Object;
  @Input() filterSubject: BehaviorSubject<Object>;
  @Input() filterState$: Observable<Object>;


  constructor(private requestSvc: RequestParametersService) {
    // Listen for changes to the limits. Required to reset the positions upon "clear filters"
    // and also for refreshing pages.
    // Pulls apart the compound limits to pass back to the filterSubject to update.
    // this.requestSvc.patientParamsState$.subscribe((params: RequestParamArray) => {
    //   console.log('NEW SEARCH PARAMS FOUND')
    //   console.log(params);
    //   // ASSUMPTION: should only be one object that matches the yearField.  Based on replacement logic in requestSvc
    //   let yearParam = params.filter(d => d.field === 'infectionYear');
    //
    //   if (yearParam.length > 0) {
    //     // console.log(yearParam[0])
    //     // console.log(yearParam[0].value)
    //     let limits = yearParam[0].value.match(/\[(\d+)\sTO\s(\d+)\]/);
    //
    //     let lower_limit = limits[1]; // 0th object == full string.
    //     let upper_limit = limits[2];
    //
    //     let unknown_val = yearParam[0].orSelector ? true : false;
    //
    //     // console.log({ lower: lower_limit, upper: upper_limit, unknown: unknown_val })
    //
    //     this.filterSubject.next({ lower: lower_limit, upper: upper_limit, unknown: unknown_val });
    //   } else {
    //     // reset
    //     // console.log('resetting')
    //     this.filterSubject.next({ lower: 0, upper: 3000, unknown: true });
    //   }
    // })
  }

  ngOnInit() {
    this.createPlot();
  }

  ngOnChanges() {
    this.updateData();
  }

  ngAfterViewInit() {
    // Update the class of the bars on update.
    // Needed to update the handle positions and the rectangle highlighting-- regardless of if the filter has been applied.
    // this.filterState$.subscribe((limits: Object) => {
    //   // ignore initial setting
    //   if (limits) {
    //     console.log("NEW LIMITS FOUND")
    //     console.log(limits)
    //     this.yearLimits = limits;
    //
    //     this.updateLimits(limits);
    //   }
    // })

    // Wait till everything is loaded; then set the initial limits
    // this.filterSubject.next({ lower: 0, upper: 3000, unknown: true });
    // this.updateLimits(this.yearLimits);
  }

  prepData() {
    // Split data into numeric + non-numeric data
    this.num_data = this.data.filter((d: any) => typeof (d.term) === 'number');
    this.unknown_data = this.data.filter((d: any) => typeof (d.term) !== 'number');

    // Add in any values if they're missing.
    this.num_data = this.requestSvc.addMissing(this.num_data, this.xDomain);
    this.unknown_data = this.requestSvc.addMissing(this.unknown_data, ['unknown']);
  }

  createPlot() {
    this.element = this.chartContainer.nativeElement;

    // this.sendParams = function(filterSubject: BehaviorSubject<Object>, requestSvc: RequestParametersService, endpoint: string) {
    //   // Check that the limits haven't flipped
    //   let lower_limit = Math.min(filterSubject.value['lower'], filterSubject.value['upper']);
    //   let upper_limit = Math.max(filterSubject.value['lower'], filterSubject.value['upper']);
    //
    //   // call requestSvc to announce new search parameters.
    //   // ES query strings: to get range (inclusive of endpoints), use `[ lower TO upper ]`
    //   // For including unknown infectionYears, run `_exists` to get anything with a non-null value.
    //   // `-` negates that query
    //   // Since `_exists` flips the variable/value pair, have the field be exists and value be the variable. e.g.: `q=-_exists_:infectionDate`
    //   filterSubject.value['unknown'] ?
    //     // include unknown as an OR statement.
    //     requestSvc.updateParams(endpoint,
    //       {
    //         field: 'infectionYear', value: `[${lower_limit} TO ${upper_limit}]`,
    //         orSelector: { field: '-_exists_', value: 'infectionYear' }
    //       }) :
    //     // ignore unknown values.
    //     requestSvc.updateParams(endpoint,
    //       { field: 'infectionYear', value: `[${lower_limit} TO ${upper_limit}]` });
    // }



    // Append SVG
    this.svg = d3.select(this.element)
      .append('svg')
      .attr("class", "barplot")
      .attr("id", this.filter_title.replace(/\s/g, "_"))
      .attr("height", this.height + this.margin.top + this.margin.bottom);

    // Slider SVG
    this.svg_slider = d3.select(this.element)
      .append('svg')
      .attr("class", "slider")
      .attr("height", this.slider_height);

    // selectors
    this.years = this.svg.append("g")
      .attr("id", "filter_hist")
      .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`);

    this.year_rects = this.years.append("g")
      .attr("class", 'filter--hist');

    this.unknown = this.svg.append("g")
      .attr("id", "unknown_hist")
      .attr("transform", `translate(${this.margin.left + this.width + this.margin.betweenGraphs}, ${this.margin.top})`);

    this.unknown_rects = this.unknown.append("g")
      .attr("class", 'filter--hist unknown');

    // --- x & y axes ---
    this.y = d3.scaleLinear()
      .rangeRound([this.height, 0]);

    this.x = d3.scaleBand()
      .rangeRound([0, this.width])
      .paddingInner(this.innerPadding)
      .paddingOuter(this.outerPadding);

    // Linear version of the scaleBand.
    // Necessary b/c need to use .invert to convert b/w ranges and domains on drag events.
    // Range is funky to account for padding on edges.
    this.xLinear = d3.scaleLinear()
      .range([this.outerPadding * this.x.step() + 0.5 * this.x.bandwidth(),
      this.width - this.outerPadding * this.x.step() - 0.5 * this.x.bandwidth()])
      // .range([this.outerPadding * this.x.step() + 0.5 * this.x.bandwidth(),
      // this.width - this.outerPadding * this.x.step() - 0.5 * this.x.bandwidth()])
      .clamp(true);


    // --- Create axes ---
    this.axisHist = this.years.append('g')
      .attr('class', 'axis axis--x axis--hists')
      .attr('transform', `translate(0, ${this.height + this.margin.axisBottom})`);

    this.unknown.append('g')
      .attr('class', 'axis axis--x axis--unknown')
      .attr('transform', `translate(0, ${this.height + this.margin.axisBottom})`);

    // Initialize w/ data, if it exists.
    if (this.data) {
      this.updateData();
    }

    // this.createSlider();
  }

  updateData() {
    console.log(this.data);
    if (this.data && this.data.length > 0 && this.svg && this.x && this.y) {
      var t = d3.transition()
        .duration(1000);

      // console.log(this.data)

      this.prepData();

      // --- Update axes ---
      console.log(this.xDomain)
      this.x
        .domain(this.xDomain.map(String));

      this.xLinear
        .domain(d3.extent(this.xDomain));


      let width2 = Math.max(this.x.bandwidth() * 1.25, this.min_width_unknown);

      this.x2 = d3.scaleBand()
        .rangeRound([0, width2])
        .paddingInner(0)
        .paddingOuter(0)
        .domain(['unknown']);

      this.xAxis = d3.axisBottom(this.x)
        .tickSizeOuter(0)
        .tickValues(this.x.domain().filter((d, i) => !(i % 2)));

      this.xAxis2 = d3.axisBottom(this.x2).tickSizeOuter(0);


      // rescale svg to proper width
      this.svg
        .attr("width", this.width + this.margin.left + this.margin.right + this.margin.betweenGraphs + width2);

      this.svg_slider
        .attr("width", this.width + this.margin.left + this.margin.right + this.margin.betweenGraphs + width2);


      this.y
        .domain([0, Math.max(d3.max(this.num_data, (d: any) => d.count), d3.max(this.unknown_data, (d: any) => d.count))]).nice();

      this.axisHist
        .call(this.xAxis);

      d3.select(".axis--unknown")
        .call(this.xAxis2);


      // --- EVENT LISTENERS ---
      // // --- Single bar event listener ---
      // let selectYear = function(filterSubject, requestSvc, endpoint, sendParams) {
      //   return function(d) {
      //     d.term === "unknown" ?
      //       filterSubject.next({ lower: 0, upper: 0, unknown: true }) :
      //       filterSubject.next({ lower: d.term, upper: d.term, unknown: false });
      //
      //     // update parameters.
      //     sendParams(filterSubject, requestSvc, endpoint);
      //   }
      // }


      // --- Create bars ---
      let year_data = this.year_rects
        .selectAll(".year-rect")
        .data(this.num_data);

      year_data.exit().remove();

      year_data.enter().append("rect")
        .attr("class", "count-rect year-rect")
        .merge(year_data)
        .attr("id", (d: any) => d.term)
        .attr("x", (d: any) => this.x(d.term))
        .attr("y", this.y(0))
        .attr("width", this.x.bandwidth())
        .attr("height", 0)
        .transition(t)
        .attr("y", (d: any) => {
          return (this.y(d.count));
        })
        .attr("height", (d: any) => this.y(0) - this.y(d.count));

      // Unknown bar
      let unknown_data = this.unknown_rects
        .selectAll(".unknown-rect")
        .data(this.unknown_data);

      unknown_data.exit().remove();

      unknown_data.enter().append("rect")
        .attr("class", "count-rect unknown-rect")
        .merge(unknown_data)
        .attr("id", (d: any) => d.term)
        .attr("x", (d: any) => this.x2(d.term) + (this.x2.bandwidth() - this.x.bandwidth()) / 2)
        .attr("y", this.y(0))
        .attr("width", this.x.bandwidth())
        .attr("height", 0)
        .transition(t)
        .attr("y", (d: any) => this.y(d.count))
        .attr("height", (d: any) => this.y(0) - this.y(d.count));


      // Event listener for click event on rects
      // d3.selectAll(".count-rect")
      // .on("click", selectYear(this.filterSubject, this.requestSvc, this.endpoint, this.sendParams));

    }
  }

  createSlider() {
    // Modified from https://bl.ocks.org/mbostock/6452972
    // and https://bl.ocks.org/johnwalley/e1d256b81e51da68f7feb632a53c3518

    // // Drag event listeners
    // let endDrag = function(xLinear: any, side: string, filterSubject: BehaviorSubject<Object>, requestSvc: RequestParametersService, endpoint: string, sendParams) {
    //   // Update the position of the handles, rectangle highlighting.
    //   updateHandles(xLinear, side, filterSubject);
    //
    //   sendParams(filterSubject, requestSvc, endpoint);
    // }
    //
    // let updateHandles = function(xLinear: any, handleSide: string, filterSubject: BehaviorSubject<Object>) {
    //   d3.event.sourceEvent.stopPropagation();
    //
    //   // convert the pixel position (range value) to data value (domain value)
    //   // round to the nearest integer to snap to a year.
    //   // After personal testing, I find this behavior to be slightly annoying... smooth feels better
    //   let xValue = (xLinear.invert(d3.event.x));
    //   // let xValue = Math.round(xScale.invert(d3.event.x));
    //
    //   // Right side updated; upper limit
    //   if (handleSide === 'right') {
    //     filterSubject.next({ ...filterSubject.value, upper: xValue });
    //   } else {
    //     // // Left side updated; lower limit
    //     filterSubject.next({ ...filterSubject.value, lower: xValue });
    //   }
    // }
    //
    // // --- Checkbox for whether to include unknown values.
    // let checkUnknown = function(filterSubject, requestSvc, endpoint, sendParams) {
    //   return function(d) {
    //     // update the status of checkbox
    //     filterSubject.next({ ...filterSubject.value, unknown: !filterSubject.value.unknown });
    //
    //     sendParams(filterSubject, requestSvc, endpoint);
    //   }
    // }


    this.slider = this.svg_slider.append("g")
      .attr("id", "year_slider")
      .attr("transform", `translate(${this.margin.left}, ${this.margin.top + 12})`);


    this.slider.append("line")
      .attr("class", "track")
      .attr("x1", this.x.range()[0])
      .attr("x2", this.x.range()[1]);

    this.slider.append("line")
      .attr("class", "track track-filled")
      .attr("x1", this.x.range()[0])
      .attr("x2", this.x.range()[1]);

    this.handle_right = this.slider.append("path")
      .attr("class", "handle-right")
      .attr("transform", `translate(${this.x.range()[1]},-5)`)
      .attr("d", this.handle_path)
      .call(d3.drag()
        .on("start.interrupt", () => this.slider.interrupt())
        // Update positions on start or drag events
        // .on("start drag", () => updateHandles(this.xLinear, 'right', this.filterSubject))
        // Once you're done, announce the new parameters to the query service.
        // .on("end", () => endDrag(this.xLinear, 'right', this.filterSubject, this.requestSvc, this.endpoint, this.sendParams))
      );

    this.handle_left = this.slider.append("path")
      .attr("class", "handle-left")
      .attr("transform", `translate(0,-5)`)
      .attr("d", this.handle_path)
      .call(d3.drag()
        .on("start.interrupt", () => this.slider.interrupt())
        // Update positions on start or drag events
        // .on("start drag", () => updateHandles(this.xLinear, 'left', this.filterSubject))
        // Once you're done, announce the new parameters to the query service.
        // .on("end", () => endDrag(this.xLinear, 'left', this.filterSubject, this.requestSvc, this.endpoint, this.sendParams))
      );


    let check = this.slider
      .append('text')
      .attr("class", "slider-checkbox")
      .attr("x", this.width + this.margin.betweenGraphs + this.x.bandwidth() * (5 / 8))
      .attr("y", "0.55em")
      .attr("dy", 2)
      .text(d => this.filterSubject.value['unknown'] ? "\uf0c8" : "\uf14a");

    // check.on("click", checkUnknown(this.filterSubject, this.requestSvc, this.endpoint, this.sendParams));


  }

  updateLimits(limits) {
    // Check to make sure the left and right handle haven't flipped sides.
    let lower_limit = Math.min(limits['lower'], limits['upper']);
    let upper_limit = Math.max(limits['lower'], limits['upper']);


    // Update rectangles
    d3.selectAll("rect")
      .classed("selected", (d: any) =>
        limits['unknown'] ?
          (d.term >= lower_limit && d.term <= upper_limit) || d.term === 'unknown' :
          d.term >= lower_limit && d.term <= upper_limit);


    // Update slider handles
    if (this.handle_left && this.handle_right) {
      this.handle_left
        .attr("transform", `translate(${this.xLinear(lower_limit) - this.x.bandwidth() * 0.5},-5)`);

      if (lower_limit === 0 && upper_limit === 0) {
        // If the limit is 0, set the left and right handles to overlap.
        this.handle_right
          .attr("transform", `translate(${this.xLinear(upper_limit) - this.x.bandwidth() * 0.5},-5)`);

        // Update position of the highlight bar
        d3.selectAll(".track-filled")
          .attr("x1", this.xLinear(lower_limit) - this.x.bandwidth() * 0.5)
          .attr("x2", this.xLinear(upper_limit) - this.x.bandwidth() * 0.5);


      } else {
        this.handle_right
          .attr("transform", `translate(${this.xLinear(upper_limit) + this.x.bandwidth() * 0.5},-5)`);

        // Update position of the highlight bar
        d3.selectAll(".track-filled")
          .attr("x1", this.xLinear(lower_limit) - this.x.bandwidth() * 0.5)
          .attr("x2", this.xLinear(upper_limit) + this.x.bandwidth() * 0.5);

      }

      d3.select(".slider-checkbox")
        .text(d => limits['unknown'] ? "\uf14a" : "\uf0c8");
    }
  }

}
