import { Component, OnInit, Input, ViewEncapsulation, ViewChild, ElementRef, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { Geojson } from '../_models';

import * as d3 from 'd3';
import * as proj from 'd3-geo-projection';
// import * as topojson from 'topojson-client';

import * as WEST_AFRICA_JSON from '../../assets/geo/naturalearth_west-africa.json';
import * as AFRICA_JSON from '../../assets/geo/naturalearth_africa.json';

@Component({
  selector: 'app-choropleth',
  templateUrl: './choropleth.component.html',
  styleUrls: ['./choropleth.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ChoroplethComponent implements OnInit {
  @ViewChild('choropleth') private chartContainer: ElementRef;
  @Input() data: any;
  west_africa: Geojson[]; // geojson of west africa data

  constructor(
    // Whether to be rendered server-side or client-side
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  // plot sizes
  private element: any;
  private width: number = 100;
  // for some reason, the lower edge of Nigeria seems to be slightly cut off by the map. Think it's a projection issue, but solving by adding slightly unequal margins
  private margin: any = { top: 0.0125*this.width, bottom: 0.03*this.width, left: 0.0125*this.width, right: 0.0125*this.width };
  private height: number; // unset; calculated to take up width of cropped map

  // --- Selectors ---
  private chart: any;
  private projection: any;

  // --- scales ---
  private path: any; // geographic coordinates
  private colorScale: any;

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.createPlot();
    }
  }

  ngOnChanges() {
    this.updatePlot();
  }

  createPlot() {
    this.element = this.chartContainer.nativeElement;
    this.west_africa = WEST_AFRICA_JSON['default']['features'];
    let AFRICA = AFRICA_JSON['default']['features'];

    // --- color scale ---
    this.colorScale = d3.scaleSequential(d3.interpolateYlGnBu)

    // --- mapping scales ---
    // Bounding box was manually chosen to crop the area to the bounding box of interest:
    // W: Guinea Western boundary
    // E: Nigeria Eastern boundary
    // N: Mali Northern boundary
    // S: Nigeria Southern boundary
    let nga = this.west_africa.filter(d => d.properties.identifier == "NG")[0];
    let gin = this.west_africa.filter(d => d.properties.identifier == "GN")[0];
    let mli = this.west_africa.filter(d => d.properties.identifier == "ML")[0];

    // First: calculate the coordinates in degrees to get the center of the map and the parallel for the projection (center latitude)
    // bounds returned as [[left, bottom] [right, top]] == [[minLon minLat] [maxLon maxLat]]
    // longitude = east/west-horizontal-x, latitude = north/south-vertical-y :)
    let minLon = d3.geoBounds(gin)[0][0],
      minLat = d3.geoBounds(nga)[0][1],
      maxLon = d3.geoBounds(nga)[1][0],
      maxLat = d3.geoBounds(mli)[1][1];

    let center = [d3.mean([minLon, maxLon]), d3.mean([minLat, maxLat])];
    let x1 = maxLon - minLon
    let y1 = maxLat - minLat

    // Next: calculate the scaling factor for the *projected* coordinates.
    // Both `.parallel` and `.center` need to be in degrees
    // Cylindrical equal area will convert into UTM units.
    // Cylindrical Equal Area chosen to have ~ equal areas for West Africa.
    // Chosen by https://projectionwizard.org/#
    this.projection = proj.geoCylindricalEqualArea()
      .parallel(center[1])
      .center(center)                // GPS of location to zoom on
      .scale(1)                       // This is like the zoom

    this.path = d3.geoPath()
      .projection(this.projection);
    // Calculate projected bounds and scale
    let bounds = [
      [this.path.bounds(gin)[0][0], this.path.bounds(nga)[0][1]],
      [this.path.bounds(nga)[1][0], this.path.bounds(mli)[1][1]]
    ],
      // from zoom to bounds: https://bl.ocks.org/mbostock/4699541
      dx = bounds[1][0] - bounds[0][0],
      // dy = bounds[1][1] - bounds[0][1],
      // x = (bounds[0][0] + bounds[1][0]) / 2,
      // y = (bounds[0][1] + bounds[1][1]) / 2,
      scale = this.width / dx * 1;

    this.height = ((y1 / x1) * this.width);

    this.projection = proj.geoCylindricalEqualArea()
      .parallel(center[1])
      .center(center)                // GPS of location to zoom on
      .scale(scale)                       // This is like the zoom
      .translate([this.width / 2, this.height / 2]);
    // .translate([this.width / 2 - scale * x, this.height / 2 - scale * y]);

    this.path = d3.geoPath()
      .projection(this.projection);

    // --- create SVG ---
    const svg = d3.select(this.element)
      .append('svg')
      .attr("class", "choropleth ocean")
      .attr("width", this.width + this.margin.left + this.margin.right)
      .attr("height", this.height + this.margin.top + this.margin.bottom);

    // selectors
    this.chart = svg.append("g")
      .attr("id", "choropleth")
      .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`);

    // --- supahfade ---
    // Create filters for glow, à la Nadieh Bremer: http://bl.ocks.org/nbremer/d3189be2788ad3ca825f665df36eed09
    // Container for the gradients
    var defs = svg.append("defs");
    var filter = defs.append("filter")
      .attr("id", "supahfade");

    filter.append("feGaussianBlur")
      .attr("class", "blur")
      .attr("stdDeviation", "7")
      .attr("result", "coloredBlur");

    // Merge only if want the outline of the stroke in addition to the stroke Gaussian blur.
    // var feMerge = filter.append("feMerge");
    // feMerge.append("feMergeNode")
    //   .attr("in", "coloredBlur");
    // feMerge.append("feMergeNode")
    //   .attr("in", "SourceGraphic");

    // --- Append basemap ---
    this.chart
      .selectAll(".africa")
      .data(AFRICA)
      .enter().append("path")
      .attr("class", "africa")
      .attr("d", this.path)
      .style("filter", "url(#supahfade)")

    this.chart
      .selectAll(".basemap")
      .data(this.west_africa)
      .enter().append("path")
      .attr("class", "basemap")
      .attr("d", this.path);

    this.updatePlot();
  }

  updatePlot() {
    if (this.data) {
      // update color
      this.colorScale.domain([0, d3.max(this.data.map(d => d.count))]);

      // --- merge data ---
      // reset from last time WEST_AFRICA was used:
      this.west_africa.forEach(d => {
        delete d.properties.count;
      })

      this.data.forEach(d => {
        let idx = this.west_africa.findIndex(geom => geom.properties.identifier == d.identifier);
        if (idx > -1) {
          this.west_africa[idx]['properties']['count'] = d.count;
        }
      })

      // --- Append choropleth ---
      this.chart
        .selectAll(".choropleth-path")
        .data(this.west_africa.filter((d: any) => d.properties.count))
        .enter().append("path")
        .attr("class", "choropleth-path")
        .style("fill", (d: any) => this.colorScale(d.properties.count))
        .attr("d", this.path);
    }
  }

}
