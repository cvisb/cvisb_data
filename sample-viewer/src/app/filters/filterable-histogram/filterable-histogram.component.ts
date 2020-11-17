import { Component, AfterViewInit, OnChanges, Inject, PLATFORM_ID, Input, ViewEncapsulation, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import * as d3 from 'd3';

import { Observable, Subscription, Subject, BehaviorSubject, throwError } from 'rxjs';

import { RequestParametersService, FilterTimepointsService } from '../../_services';
import { D3Nested, RequestParam, RequestParamArray } from '../../_models';

@Component({
  selector: 'app-filterable-histogram',
  templateUrl: './filterable-histogram.component.html',
  styleUrls: ['./filterable-histogram.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class FilterableHistogramComponent implements AfterViewInit, OnChanges {
  @ViewChild('hist') private chartContainer: ElementRef;

  // data
  @Input() public data: D3Nested[];
  @Input() public xDomain: number[];
  @Input() public endpoint: string;
  @Input() public filter_title: string;
  @Input() public filterHandler: Function;
  @Input() public windsorized: number = 2007; // all values including this are lumped together. Currently, there's a decent number of patients at 2008+,
  @Input() public filterable: boolean = true;
  @Input() public unknown: boolean = true; // whether unknown values should be included


  private num_data: Object[]; // numeric portion of the data
  private unknown_data: Object[]; // unknown years


  // plot sizes
  private element: any;
  // private element_dims: any;
  private margin: any = { top: 0, bottom: 25, left: 12, right: 12, axisBottom: 3, betweenGraphs: 15 };
  @Input() private min_width_unknown: number = 40;
  @Input() private width: number = 150;
  @Input() private height: number = 90;
  private slider_height: number = 50;
  @Input() private numXTicks: number = 5;
  // private bar_height: number = 10;
  // private bar_spacing: number = 3;

  // --- Selectors ---
  private years: any; // normal histogram
  private year_rects: any; // normal histogram bars
  private rects: any; // any histogram bar
  private unknownGraph: any; // unknown graph
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
  private xAxis: any;
  private xAxis2: any;
  private axisHist: any;
  private axisUnknown: any;

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
  patientSubscription: Subscription;
  sampleSubscription: Subscription;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private filterSvc: FilterTimepointsService,
    private requestSvc: RequestParametersService) {
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

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.createPlot();
      if (this.filterable) {
        switch (this.endpoint) {
          case "patient":
            this.patientSubscription = this.requestSvc.patientParamsState$.subscribe(params => {
              this.checkParams(params);
            })
            break;

          case "sample":
            this.sampleSubscription = this.requestSvc.sampleParamsState$.subscribe(params => {
              this.checkParams(params);
            })
            break;
        }
      }
    }

    if (this.filterable) {
      // Wait till everything is loaded; then set the initial limits
      this.filterSubject.next({ lower: 0, upper: 3000, unknown: true });
    }
  }

  ngOnDestroy() {
    if (this.patientSubscription) {
      this.patientSubscription.unsubscribe();
    }
    if (this.sampleSubscription) {
      this.sampleSubscription.unsubscribe();
    }
  }

  checkParams(params) {
    if (params.length === 0) {
      this.updateLimits({ lower: 0, upper: 3000, unknown: true }, this.x, this.xLinear, this.slider, this.handle_left, this.handle_right, this.filterable)
    }
  }

  ngOnChanges() {
    this.updateData();
  }

  // ngAfterViewInit() {
  //   // Update the class of the bars on update.
  //   // Needed to update the handle positions and the rectangle highlighting-- regardless of if the filter has been applied.
  //   // this.filterState$.subscribe((limits: Object) => {
  //   //   // ignore initial setting
  //   //   if (limits) {
  //   //     console.log("NEW LIMITS FOUND")
  //   //     console.log(limits)
  //   //     this.yearLimits = limits;
  //   //
  //   //     this.updateLimits(limits);
  //   //   }
  //   // })
  //
  // }

  prepData() {
    if (this.data) {
      // Split data into numeric + non-numeric data
      this.num_data = this.data.filter((d: any) => typeof (d.term) === 'number');
      this.unknown_data = this.data.filter((d: any) => typeof (d.term) !== 'number');

      // combine together the values below the limit
      if (this.windsorized) {
        this.xDomain = this.xDomain.filter(d => d >= this.windsorized);
        this.xDomain.push(this.windsorized); // add in windsorized value

        let windsorData = this.num_data ? this.num_data.filter((d: any) => d.term < this.windsorized) : [];
        let windsorCount = windsorData.reduce((prev, curr) => prev + curr['count'], 0);

        this.num_data = this.num_data.filter((d: any) => d.term >= this.windsorized);
        this.num_data.push({ term: this.windsorized, count: windsorCount });
      }

      // create linear range of values
      this.xDomain = d3.range(d3.min(this.xDomain), d3.max(this.xDomain) + 1);

      // Add in any values if they're missing.
      this.num_data = this.requestSvc.addMissing(this.num_data, this.xDomain);
      this.unknown_data = this.requestSvc.addMissing(this.unknown_data, ['unknown']);
    }
  }

  createPlot() {
    this.element = this.chartContainer.nativeElement;

    // Append SVG
    this.svg = d3.select(this.element)
      .append('svg')
      .attr("class", "barplot")
      .attr("id", this.filter_title.replace(/\s/g, "_"))
      .attr("height", this.height + this.margin.top + this.margin.bottom);

    // Slider SVG
    if (!this.filterable) {
      this.slider_height = 0;
    }
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

    if (this.unknown) {
      this.unknownGraph = this.svg.append("g")
        .attr("id", "unknown_hist")
        .attr("transform", `translate(${this.margin.left + this.width + this.margin.betweenGraphs}, ${this.margin.top})`);

      this.unknown_rects = this.unknownGraph.append("g")
        .attr("class", 'filter--hist unknown');
    }
    this.rects = d3.select("#" + this.filter_title.replace(/\s/g, "_")).selectAll(".count-rect");

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
      .clamp(true);


    // --- Create axes ---
    this.axisHist = this.years.append('g')
      .attr('class', 'axis axis--x axis--hists')
      .attr('transform', `translate(0, ${this.height + this.margin.axisBottom})`);

    if (this.unknown) {
      this.axisUnknown = this.unknownGraph.append('g')
        .attr('class', 'axis axis--x axis--unknown')
        .attr('transform', `translate(0, ${this.height + this.margin.axisBottom})`);
    }
    // Initialize w/ data, if it exists.
    if (this.data) {
      this.updateData();
    }
    if (this.filterable) {
      this.createSlider();
    }
  }

  updateData() {
    if (this.data && this.data.length > 0 && this.svg && this.x && this.y) {
      var t = d3.transition()
        .duration(1000);

      this.prepData();

      // --- Update axes ---
      this.x
        .domain(this.xDomain.map(String));

      this.xLinear
        .range([this.outerPadding * this.x.step() + 0.5 * this.x.bandwidth(),
        this.width - this.outerPadding * this.x.step() - 0.5 * this.x.bandwidth()])
        .domain(d3.extent(this.xDomain));


      let width2: number; // size of unknown bar width.

      if (this.unknown) {
        width2 = Math.max(this.x.bandwidth() * 1.25, this.min_width_unknown);

        this.x2 = d3.scaleBand()
          .rangeRound([0, width2])
          .paddingInner(0)
          .paddingOuter(0)
          .domain(['unknown']);

        this.xAxis2 = d3.axisBottom(this.x2).tickSizeOuter(0);

        this.axisUnknown
          .call(this.xAxis2);
      } else {
        width2 = 0;
        this.margin.betweenGraphs = 0;
      }

      // rescale svg to proper width
      this.svg
        .attr("width", this.width + this.margin.left + this.margin.right + this.margin.betweenGraphs + width2);

      this.svg_slider
        .attr("width", this.width + this.margin.left + this.margin.right + this.margin.betweenGraphs + width2);

      // Only show 5 values in the histogram.
      let tickSpacing = Math.round(this.x.domain().length / this.numXTicks);

      this.xAxis = d3.axisBottom(this.x)
        .tickSizeOuter(0)
        .tickValues(this.x.domain().filter((_, i) => !(i % tickSpacing)));


      this.y
        .domain([0, Math.max(d3.max(this.num_data, (d: any) => d.count), d3.max(this.unknown_data, (d: any) => d.count))]).nice();

      this.axisHist
        .call(this.xAxis);



      // Function for windsorized data:
      if (this.windsorized) {
        d3.selectAll(".axis--x").selectAll(".tick text")
          .classed("windsor-value", (_, i) => i === 0)
          .html((d: string, i) => (i === 0 && d !== "unknown") ? `&le; ${d}` : d);
      }


      // --- EVENT LISTENERS ---
      // --- Single bar event listener ---
      let selectBar = function(filterFunc, filterSvc, requestSvc, endpoint, updateLimits, x, xLinear, slider, handle_left, handle_right, windsorized, filterable) {
        return function(d) {
          let limits: Object;


          if (d.term === "unknown") {
            limits = { lower: null, upper: null, unknown: true };
          }
          else if (windsorized && d.term <= Number(x.domain()[0])) {
            limits = { lower: 0, upper: d.term, unknown: false };
          }
          else if (windsorized && d.term >= Number(x.domain()[x.domain().length - 1])) {
            limits = { lower: d.term, upper: 3000, unknown: false };
          }
          else {
            limits = { lower: d.term, upper: d.term, unknown: false };
          }

          updateLimits(limits, x, xLinear, slider, handle_left, handle_right, filterable);
          filterFunc(limits, filterSvc, requestSvc, endpoint);
        }
      }


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
        .classed("selectable", _ => this.filterable)
        .classed("selected", _ => true)
        // d.term >= this.filterSubject.value['lower'] && d.term <= this.filterSubject.value['upper'])
        .transition(t)
        .attr("y", (d: any) => {
          return (this.y(d.count));
        })
        .attr("height", (d: any) => this.y(0) - this.y(d.count));

      // Unknown bar
      if (this.unknown) {
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
          .classed("selectable", _ => this.filterable)
          .classed("selected", _ => true)
          .transition(t)
          .attr("y", (d: any) => this.y(d.count))
          .attr("height", (d: any) => this.y(0) - this.y(d.count));
      }


      // Event listener for click event on rects
      // Select the rects after they've been drawn.
      this.rects = d3.select("#" + this.filter_title.replace(/\s/g, "_")).selectAll(".count-rect");

      if (this.filterable) {
        this.rects
          .on("click", selectBar(this.filterHandler, this.filterSvc, this.requestSvc, this.endpoint, this.updateLimits, this.x, this.xLinear, this.slider, this.handle_left, this.handle_right, this.windsorized, this.filterable));
      }
    }
  }

  createSlider() {
    // Modified from https://bl.ocks.org/mbostock/6452972
    // and https://bl.ocks.org/johnwalley/e1d256b81e51da68f7feb632a53c3518

    // Drag event listeners
    let endDrag = function(x, xLinear, slider, handle_left, handle_right, side: string, updateLimits, filterSubject: BehaviorSubject<Object>, requestSvc: RequestParametersService, endpoint: string, filterFunc, filterSvc, windsorized, filterable) {
      // let endDrag = function(xLinear: any, side: string, filterSubject: BehaviorSubject<Object>, requestSvc: RequestParametersService, endpoint: string, sendParams) {
      // Update the position of the handles, rectangle highlighting.
      updateHandles(x, xLinear, slider, handle_left, handle_right, side, updateLimits, filterSubject, windsorized, filterable);

      let limits = filterSubject.value;
      filterFunc(limits, filterSvc, requestSvc, endpoint);
    }

    let updateHandles = function(x, xLinear, slider, handle_left, handle_right, handleSide: string, updateLimits, filterSubject: BehaviorSubject<Object>, windsorized, filterable) {
      // let updateHandles = function(xLinear: any, handleSide: string, filterSubject: BehaviorSubject<Object>) {
      d3.event.sourceEvent.stopPropagation();

      // convert the pixel position (range value) to data value (domain value)
      // round to the nearest integer to snap to a year.
      // After personal testing, I find this behavior to be slightly annoying... smooth feels better
      let xValue = (xLinear.invert(d3.event.x));

      // Right side updated; upper limit
      if (handleSide === 'right') {
        if (windsorized && xValue === Number(x.domain()[x.domain.length - 1]) && endDrag) {
          xValue = 3000;
        }
        updateLimits({ ...filterSubject.value, upper: xValue }, x, xLinear, slider, handle_left, handle_right, filterable);
        filterSubject.next({ ...filterSubject.value, upper: Math.round(xValue) });
      } else {
        if (windsorized && xValue === Number(x.domain()[0])) {
          xValue = 0;
        }

        updateLimits({ ...filterSubject.value, lower: xValue }, x, xLinear, slider, handle_left, handle_right, filterable);
        // Left side updated; lower limit
        filterSubject.next({ ...filterSubject.value, lower: Math.round(xValue) });
      }
    }

    // --- Checkbox for whether to include unknown values.
    let checkUnknown = function(filterSubject, requestSvc, endpoint, filterFunc, filterSvc) {
      return function(_) {
        // update the status of checkbox
        let limits = { ...filterSubject.value, unknown: !filterSubject.value.unknown };
        filterSubject.next(limits);

        // update the check status
        d3.select(".slider-checkbox")
          .text(_ => limits['unknown'] ? "\uf14a" : "\uf0c8");

        filterFunc(limits, filterSvc, requestSvc, endpoint);
        // sendParams(filterSubject, requestSvc, endpoint);
      }
    }


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
        .on("start drag", () => updateHandles(this.x, this.xLinear, this.slider, this.handle_left, this.handle_right, 'right', this.updateLimits, this.filterSubject, this.windsorized, this.filterable))
        // Once you're done, announce the new parameters to the query service.
        .on("end", () => endDrag(this.x, this.xLinear, this.slider, this.handle_left, this.handle_right, 'right', this.updateLimits, this.filterSubject, this.requestSvc, this.endpoint, this.filterHandler, this.filterSvc, this.windsorized, this.filterable))
      );

    this.handle_left = this.slider.append("path")
      .attr("class", "handle-left")
      .attr("transform", `translate(0,-5)`)
      .attr("d", this.handle_path)
      .call(d3.drag()
        .on("start.interrupt", () => this.slider.interrupt())
        // Update positions on start or drag events
        .on("start drag", () => updateHandles(this.x, this.xLinear, this.slider, this.handle_left, this.handle_right, 'left', this.updateLimits, this.filterSubject, this.windsorized, this.filterable))
        // Once you're done, announce the new parameters to the query service.
        .on("end", () => endDrag(this.x, this.xLinear, this.slider, this.handle_left, this.handle_right, 'left', this.updateLimits, this.filterSubject, this.requestSvc, this.endpoint, this.filterHandler, this.filterSvc, this.windsorized, this.filterable))
      );

    this.x2
    let check = this.slider
      .append('text')
      .attr("class", "slider-checkbox")
      .attr("x", this.width + this.margin.betweenGraphs + Math.max(this.x.bandwidth() * 1.25, this.min_width_unknown) * (1 / 2))
      .attr("y", "0.55em")
      .attr("dy", -5)
      .text("\uf14a");
    // .text(_ => this.filterSubject.value['unknown'] ? "\uf0c8" : "\uf14a");

    check.on("click", checkUnknown(this.filterSubject, this.requestSvc, this.endpoint, this.filterHandler, this.filterSvc));


  }

  updateLimits(limits, x, xLinear, slider, handle_left, handle_right, filterable) {
    // console.log('updating limits')
    // console.log(limits)
    // Check to make sure the left and right handle haven't flipped sides.
    let lower_limit = Math.round(Math.min(limits['lower'], limits['upper']));
    let upper_limit = Math.round(Math.max(limits['lower'], limits['upper']));

    // Update rectangles
    d3.selectAll("rect")
      .classed("selected", (d: any) => {
        if (d) {
          return limits['unknown'] && filterable ?
            (d.term >= lower_limit && d.term <= upper_limit) || d.term === 'unknown' :
            d.term >= lower_limit && d.term <= upper_limit;
        }
      })


    // Update slider handles
    if (handle_left && handle_right) {
      handle_left
        .attr("transform", `translate(${xLinear(lower_limit) - x.bandwidth() * 0.5},-5)`);

      if (lower_limit === 0 && upper_limit === 0) {
        // If the limit is 0, set the left and right handles to overlap.
        handle_right
          .attr("transform", `translate(${xLinear(upper_limit) - x.bandwidth() * 0.5},-5)`);

        // Update position of the highlight bar
        slider.selectAll(".track-filled")
          .attr("x1", xLinear(lower_limit) - x.bandwidth() * 0.5)
          .attr("x2", xLinear(upper_limit) - x.bandwidth() * 0.5);


      } else {
        handle_right
          .attr("transform", `translate(${xLinear(upper_limit) + x.bandwidth() * 0.5},-5)`);

        // Update position of the highlight bar
        slider.selectAll(".track-filled")
          .attr("x1", xLinear(lower_limit) - x.bandwidth() * 0.5)
          .attr("x2", xLinear(upper_limit) + x.bandwidth() * 0.5);

      }

      d3.select(".slider-checkbox")
        .text(_ => limits['unknown'] ? "\uf14a" : "\uf0c8");
    }
  }

}
