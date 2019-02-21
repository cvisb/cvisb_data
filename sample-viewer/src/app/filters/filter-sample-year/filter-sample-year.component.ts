import { Component, OnInit, OnChanges, AfterViewInit, Input, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';

import * as d3 from 'd3';

import { Observable, Subject, BehaviorSubject, throwError } from 'rxjs';

import { D3Nested } from '../../_models';

@Component({
  selector: 'app-filter-sample-year',
  templateUrl: './filter-sample-year.component.html',
  styleUrls: ['./filter-sample-year.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class FilterSampleYearComponent implements OnInit {
  @ViewChild('hist') private chartContainer: ElementRef;

  // data
  @Input() public data: D3Nested[];


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
  private unknown: any; // unknown bar
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

  // --- Constants ---
  handle_path: string = "M4.1,11V-1L0.5-5.5L-3.1-1v12H4.1z";
  innerPadding: number = 0.2;
  outerPadding: number = 0.2;

  // Event listener for filter limits
  yearLimits: Object;
  public yearFilterSubject: BehaviorSubject<Object> = new BehaviorSubject<Object>({});
  public yearFilterState$ = this.yearFilterSubject.asObservable();


  constructor() {
    // Update the class of the bars on update.
    this.yearFilterState$.subscribe((limits: Object) => {
      this.yearLimits = limits;

      // Check to make sure the left and right handle haven't flipped sides.
      let lower_limit = Math.min(limits['lower'], limits['upper']);
      let upper_limit = Math.max(limits['lower'], limits['upper']);


      // Update rectangles
      d3.selectAll("rect")
        .classed("selected", (d: any) =>
          limits['unknown'] ?
            (d.key >= lower_limit && d.key <= upper_limit) || d.key === 'unknown' :
            d.key >= lower_limit && d.key <= upper_limit);


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
    })
  }

  ngOnInit() {
    if (this.data) {
      this.createPlot();
    }
  }

  ngOnChanges() {
    this.updateData();
  }

  ngAfterViewInit() {
    // Wait till everything is loaded; then set the initial limits
    this.yearFilterSubject.next({ lower: 0, upper: 3000, unknown: true });
  }

  prepData() {
    // Split data into numeric + non-numeric data
    this.num_data = this.data.filter((d: any) => typeof (d.key) === 'number');
    this.unknown_data = this.data.filter((d: any) => typeof (d.key) !== 'number');
  }

  createPlot() {
    this.element = this.chartContainer.nativeElement;

    this.prepData();

    // Append SVG
    this.svg = d3.select(this.element)
      .append('svg')
      .attr("class", "barplot")
      .attr("height", this.height + this.margin.top + this.margin.bottom);

    // Slider SVG
    this.svg_slider = d3.select(this.element)
      .append('svg')
      .attr("class", "slider")
      .attr("height", this.slider_height);

    // selectors
    this.years = this.svg.append("g")
      .attr("id", "year_hist")
      .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`);

    this.unknown = this.svg.append("g")
      .attr("id", "unknown_hist")
      .attr("transform", `translate(${this.margin.left + this.width + this.margin.betweenGraphs}, ${this.margin.top})`);

    // --- x & y axes ---
    this.y = d3.scaleLinear()
      .rangeRound([this.height, 0]);

    this.x = d3.scaleBand()
      .rangeRound([0, this.width])
      .paddingInner(this.innerPadding)
      .paddingOuter(this.outerPadding);

    this.updateData();
  }

  updateData() {
    if (this.num_data) {
      this.prepData();

      // --- x & y axes ---
      this.x.domain(this.num_data.map((d: any) => d.key));

      // Linear version of the scaleBand.
      // Necessary b/c need to use .invert to convert b/w ranges and domains on drag events.
      // Range is funky to account for padding on edges.
      this.xLinear = d3.scaleLinear()
        .range([this.outerPadding * this.x.step() + 0.5 * this.x.bandwidth(),
        this.width - this.outerPadding * this.x.step() - 0.5 * this.x.bandwidth()])
        // .range([this.outerPadding * this.x.step() + 0.5 * this.x.bandwidth(),
        // this.width - this.outerPadding * this.x.step() - 0.5 * this.x.bandwidth()])
        .domain(d3.extent(this.num_data, (d: any) => d.key))
        .clamp(true);

      let width2 = Math.max(this.x.bandwidth() * 1.25, this.min_width_unknown);

      this.y
        .domain([0, Math.max(d3.max(this.num_data, (d: any) => d.value), d3.max(this.unknown_data, (d: any) => d.value))]).nice();

      // rescale svg to proper width
      this.svg
        .attr("width", this.width + this.margin.left + this.margin.right + this.margin.betweenGraphs + width2)

      this.svg_slider
        .attr("width", this.width + this.margin.left + this.margin.right + this.margin.betweenGraphs + width2)

      this.x2 = d3.scaleBand()
        .rangeRound([0, width2])
        .paddingInner(0)
        .paddingOuter(0)
        .domain(this.unknown_data.map((d: any) => d.key));

      this.xAxis = d3.axisBottom(this.x).tickSizeOuter(0);
      this.xAxis2 = d3.axisBottom(this.x2).tickSizeOuter(0);

      // --- Create axes ---
      this.years.append('g')
        .attr('class', 'axis axis--x')
        .attr('transform', `translate(0, ${this.height + this.margin.axisBottom})`)
        .call(this.xAxis);

      this.unknown.append('g')
        .attr('class', 'axis axis--x axis--unknown')
        .attr('transform', `translate(0, ${this.height + this.margin.axisBottom})`)
        .call(this.xAxis2);


      // --- Single bar event listener ---
      let selectYear = function(yearFilterSubject) {
        return function(d) {
          d.key === "unknown" ?
            yearFilterSubject.next({ lower: 0, upper: 0, unknown: true }) :
            yearFilterSubject.next({ lower: d.key, upper: d.key, unknown: false });
        }
      }



      // --- Create bars ---
      this.years.append("g")
        .attr("class", 'filter--year')
        .selectAll(".bars")
        .data(this.num_data)
        .enter().append("rect")
        .attr("class", "year-rect")
        .attr("id", (d: any) => d.key)
        .attr("x", (d: any) => this.x(d.key))
        .attr("y", (d: any) => this.y(d.value))
        .attr("width", this.x.bandwidth())
        .attr("height", (d: any) => this.y(0) - this.y(d.value));



      this.unknown.append("g")
        .attr("class", 'filter--year unknown')
        .selectAll(".unknown")
        .data(this.unknown_data)
        .enter().append("rect")
        .attr("class", "year-rect")
        .attr("id", (d: any) => d.key)
        .attr("x", (d: any) => this.x2(d.key) + (this.x2.bandwidth() - this.x.bandwidth()) / 2)
        .attr("y", (d: any) => this.y(d.value))
        .attr("width", this.x.bandwidth())
        .attr("height", (d: any) => this.y(0) - this.y(d.value));


      // Event listener for click event on rects
      d3.selectAll(".year-rect")
        .on("click", selectYear(this.yearFilterSubject));

      this.createSlider();

    }
  }

  createSlider() {
    // Modified from https://bl.ocks.org/mbostock/6452972
    // and https://bl.ocks.org/johnwalley/e1d256b81e51da68f7feb632a53c3518
    this.slider = this.svg_slider.append("g")
      .attr("id", "year_slider")
      .attr("transform", `translate(${this.margin.left}, ${this.margin.top + 12})`);


    this.slider.append("line")
      .attr("class", "track")
      .attr("x1", this.x.range()[0])
      .attr("x2", this.x.range()[1])
    // .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
    // .attr("class", "track-inset")
    // .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
    // .attr("class", "track-overlay")
    // .call(d3.drag()
    //   .on("start.interrupt", () => this.slider.interrupt())
    //   .on("start drag", () => hue(this.x, this.handle, d3.event)));

    this.slider.append("line")
      .attr("class", "track track-filled")
      .attr("x1", this.x.range()[0])
      .attr("x2", this.x.range()[1]);
    // .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
    // .attr("class", "track-inset")
    // .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
    // .attr("class", "track-overlay")
    // .call(d3.drag()
    //   .on("start.interrupt", () => this.slider.interrupt())
    //   .on("start drag", () => hue(this.x, this.handle, d3.event)));
    // .on("start drag", () => hue(this.x, this.handle, this.x.invert(d3.event.x))));

    // this.slider.insert("g", ".track-overlay")
    //   .attr("class", "ticks")
    //   .attr("transform", "translate(0," + 18 + ")")
    //   .selectAll("text")
    //   .data(this.x.ticks(10))
    //   .enter().append("text")
    //   .attr("x", this.x)
    //   .attr("text-anchor", "middle")
    //   .text(function(d) { return d + "°"; });

    this.handle_right = this.slider.append("path")
      // this.handle = this.slider.insert("circle", ".track-overlay")
      .attr("class", "handle-right")
      .attr("transform", `translate(${this.x.range()[1]},-5)`)
      .attr("d", this.handle_path)
      .call(d3.drag()
        .on("start.interrupt", () => this.slider.interrupt())
        .on("start drag", () => startDrag(this.xLinear, 'right', this.yearFilterSubject))
        // .on("end drag", () => endDrag())
      );

    this.handle_left = this.slider.append("path")
      .attr("class", "handle-left")
      .attr("transform", `translate(0,-5)`)
      .attr("d", this.handle_path)
      .call(d3.drag()
        .on("start.interrupt", () => this.slider.interrupt())
        .on("start drag", () => startDrag(this.xLinear, 'left', this.yearFilterSubject))
        // .on("end drag", () => endDrag())
      );


    // Drag event listeners
    function endDrag() {
      if (d3.event.defaultPrevented) {
        console.log("STOP!")
      }
    }

    function startDrag(xScale, handleSide, yearFilterSubject) {
      d3.event.sourceEvent.stopPropagation();

      // convert the pixel position (range value) to data value (domain value)
      // round to the nearest integer to snap to a year.
      // After personal testing, I find this behavior to be slightly annoying... smooth feels better
      let xValue = (xScale.invert(d3.event.x));
      // let xValue = Math.round(xScale.invert(d3.event.x));

      // Right side updated; upper limit
      if (handleSide === 'right') {
        yearFilterSubject.next({ ...yearFilterSubject.value, upper: xValue });
        // yearFilterSubject.next({ lower: currentLimits['lower'], upper: xValue, unknown: currentLimits['unknown'] });
      } else {
        // // Left side updated; lower limit
        yearFilterSubject.next({ ...yearFilterSubject.value, lower: xValue });
        // yearFilterSubject.next({ lower: xValue, upper: currentLimits['upper'], unknown: currentLimits['unknown'] });
      }
    }


    // --- Checkbox for unknown values.

    let checkUnknown = function(yearFilterSubject) {
      return function(d) {
        // d3.select(this)
        // .each(function(d) { this._current = true; })
        //   .text(d => this._current ? "\uf0c8" : "\uf14a");

        // update the status of checkbox
        yearFilterSubject.next({ ...yearFilterSubject.value, unknown: !yearFilterSubject.value.unknown });
      }
    }


    let check = this.slider
      .append('text')
      .attr("class", "slider-checkbox")
      .attr("x", this.width + this.margin.betweenGraphs + this.x.bandwidth() * (5 / 8))
      .attr("y", "0.55em")
      .attr("dy", 2)
      .text(d => this.yearFilterSubject.value['unknown'] ? "\uf0c8" : "\uf14a");

    check.on("click", checkUnknown(this.yearFilterSubject));


  }

}

// TODO
// 4. event listener to pass values --- check why not connecting b/w checkbox and yearLimits.
// 5. create the filter event listener.
// 6. check update procedure: enter/append/merge
// 7. click single bar-- listen for limits.
