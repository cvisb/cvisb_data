import { Component, AfterViewInit, Input, ViewEncapsulation, ViewChild, ElementRef, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { Geojson } from '../_models';

import { select, scaleSequential, interpolateYlGnBu, geoBounds, geoPath, geoEqualEarth, mean, max } from 'd3';
import { geoCylindricalEqualArea } from 'd3-geo-projection';
// import * as topojson from 'topojson-client';

import WEST_AFRICA_JSON from '../../assets/geo/naturalearth_west-africa.json';
import AFRICA_JSON from '../../assets/geo/naturalearth_africa.json';
import WORLD from '../../assets/geo/world.json';
import WORLD_FUSED from '../../assets/geo/world_fused.json';

@Component({
  selector: 'app-choropleth',
  templateUrl: './choropleth.component.html',
  styleUrls: ['./choropleth.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ChoroplethComponent implements AfterViewInit {
  @ViewChild('choropleth') private chartContainer: ElementRef;
  @Input() data: any;
  isWestAfrica: boolean;
  map_data: Geojson[]; // geojson of west africa data
  basemap: Geojson[]; // geojson of basemap for supahfade

  constructor(
    // Whether to be rendered server-side or client-side
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  // plot sizes
  private element: any;
  @Input() height: number = 115;
  // for some reason, the lower edge of Nigeria seems to be slightly cut off by the map. Think it's a projection issue, but solving by adding slightly unequal margins
  private width: number; // unset; calculated to take up width of cropped map

  // --- Selectors ---
  private chart: any;
  private projection: any;

  // --- scales ---
  private path: any; // geographic coordinates
  private colorScale: any;

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.createPlot();
    }
  }

  ngOnChanges() {
    this.updatePlot();
  }

  createPlot() {
    this.element = this.chartContainer.nativeElement;

    // --- color scale ---
    this.colorScale = scaleSequential(interpolateYlGnBu);

    // --- modify mapping data ---
    let westafrica = ["BF","BJ","CF","CI","CM","DZ","EH","GH","GM","GN","GW","LR","LY","MA","ML","MR","NE","NG","SL","SN","TD","TG"];

    this.isWestAfrica = this.data.every(d => westafrica.includes(d.identifier));
    if (this.isWestAfrica) {
      this.map_data = WEST_AFRICA_JSON;
      this.basemap = AFRICA_JSON as any;

      // --- mapping scales ---
      // Bounding box was manually chosen to crop the area to the bounding box of interest:
      // W: Guinea Western boundary
      // E: Nigeria Eastern boundary
      // N: Mali Northern boundary
      // S: Nigeria Southern boundary
      let nga = this.map_data.filter(d => d.properties.identifier == "NG")[0];
      let gin = this.map_data.filter(d => d.properties.identifier == "GN")[0];
      let mli = this.map_data.filter(d => d.properties.identifier == "ML")[0];

      // First: calculate the coordinates in degrees to get the center of the map and the parallel for the projection (center latitude)
      // bounds returned as [[left, bottom] [right, top]] == [[minLon minLat] [maxLon maxLat]]
      // longitude = east/west-horizontal-x, latitude = north/south-vertical-y :)
      let minLon = geoBounds(gin as any)[0][0],
        minLat = geoBounds(nga as any)[0][1],
        maxLon = geoBounds(nga as any)[1][0],
        maxLat = geoBounds(mli as any)[1][1];

      let center = [mean([minLon, maxLon]), mean([minLat, maxLat])];
      let x1 = maxLon - minLon
      let y1 = maxLat - minLat

      // Next: calculate the scaling factor for the *projected* coordinates.
      // Both `.parallel` and `.center` need to be in degrees
      // Cylindrical equal area will convert into UTM units.
      // Cylindrical Equal Area chosen to have ~ equal areas for West Africa.
      // Chosen by https://projectionwizard.org/#
      this.projection = geoCylindricalEqualArea()
        .parallel(center[1])
        .center(center)                // GPS of location to zoom on
        .scale(1)                       // This is like the zoom

      this.path = geoPath()
        .projection(this.projection);
      // Calculate projected bounds and scale
      let bounds = [
        [this.path.bounds(gin)[0][0], this.path.bounds(nga)[0][1]],
        [this.path.bounds(nga)[1][0], this.path.bounds(mli)[1][1]]
      ],
        // from zoom to bounds: https://bl.ocks.org/mbostock/4699541
        dy = bounds[1][1] - bounds[0][1],
        scale = this.height / (dy * 6.15);

      this.width = this.height / (y1 / x1);

      this.projection = geoCylindricalEqualArea()
        .parallel(center[1])
        .center(center)                // GPS of location to zoom on
        .scale(scale)                       // This is like the zoom
        .translate([this.width / 2, this.height / 2]);
    } else {
      this.map_data = WORLD;
      this.basemap = WORLD_FUSED;

      // First: calculate the coordinates in degrees to get the center of the map and the parallel for the projection (center latitude)
      // bounds returned as [[left, bottom] [right, top]] == [[minLon minLat] [maxLon maxLat]]
      // longitude = east/west-horizontal-x, latitude = north/south-vertical-y :)
      let minLon = -155,
        minLat = -90,
        maxLon = 160,
        maxLat = 90;

      let center = [15, 7] as any;
      let x1 = maxLon - minLon
      let y1 = maxLat - minLat

      // Next: calculate the scaling factor for the *projected* coordinates.
      // Both `.parallel` and `.center` need to be in degrees
      // Cylindrical equal area will convert into UTM units.
      // Cylindrical Equal Area chosen to have ~ equal areas for West Africa.
      // Chosen by https://projectionwizard.org/#
      this.projection = geoEqualEarth()
        .center(center)                // GPS of location to zoom on
        .scale(1)                       // This is like the zoom

      this.path = geoPath()
        .projection(this.projection);
      // Calculate projected bounds and scale
      let bounds = [[-90, 90], [-180, 180]],
        // from zoom to bounds: https://bl.ocks.org/mbostock/4699541
        scale = this.height / (Math.PI * 0.8);//this.width / dx * 1;

      this.width = this.height / (y1 / x1);

      this.projection = geoEqualEarth()
        .center(center)                // GPS of location to zoom on
        .scale(scale)                       // This is like the zoom
        .translate([this.width / 2, this.height / 2]);
    }

    this.path = geoPath()
      .projection(this.projection);

    // --- create SVG ---
    const svg = select(this.element)
      .append('svg')
      .attr("class", "choropleth ocean")
      .attr("width", this.width)
      .attr("height", this.height);

    // selectors
    this.chart = svg.append("g")
      .attr("id", "choropleth");

    // --- supahfade ---
    // Create filters for glow, à la Nadieh Bremer: http://bl.ocks.org/nbremer/d3189be2788ad3ca825f665df36eed09
    // Container for the gradients
    var defs = svg.append("defs");
    var filter = defs.append("filter")
      .attr("id", "supahfade");

    filter.append("feGaussianBlur")
      .attr("class", "blur")
      // .attr("stdDeviation", "7")
      .attr("stdDeviation", "5")
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
      .data(this.basemap)
      .enter().append("path")
      .attr("class", this.isWestAfrica ? "africa" : "world")
      .attr("d", this.path)
      .style("filter", "url(#supahfade)")

    this.chart
      .selectAll(".basemap")
      .data(this.map_data)
      .enter().append("path")
      .attr("class", "basemap")
      .attr("d", this.path);

    this.updatePlot();
  }

  updatePlot() {
    if (this.data && this.colorScale) {
      // update color
      this.colorScale.domain([0, max(this.data.map(d => d.count))]);

      // --- merge data ---
      // reset from last time WEST_AFRICA was used:
      this.map_data.forEach(d => {
        delete d.properties.count;
      })

      this.data.forEach(d => {
        let idx = this.map_data.findIndex(geom => geom.properties.identifier == d.identifier);
        if (idx > -1) {
          this.map_data[idx]['properties']['count'] = d.count;
        }
      })

      // --- Append choropleth ---
      let choroSelector = this.chart
        .selectAll(".choropleth-path")
        .data(this.map_data.filter((d: any) => d.properties.count));

        choroSelector.exit().remove();

        choroSelector.enter().append("path")
        .attr("class", "choropleth-path")
        .merge(choroSelector)
        .style("fill", (d: any) => this.colorScale(d.properties.count))
        .attr("d", this.path);
    }
  }

}
