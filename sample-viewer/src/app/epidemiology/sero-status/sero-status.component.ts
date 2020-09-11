import { Component, OnInit } from '@angular/core';

import * as d3 from 'd3';

@Component({
  selector: 'app-sero-status',
  templateUrl: './sero-status.component.html',
  styleUrls: ['./sero-status.component.scss']
})

export class SeroStatusComponent implements OnInit {
  // --- plot params ---
  width: number = 300;
  height: number = 150;
  margin: Object = { top: 0, bottom: 70, left: 35, right: 35};
  statusOffset: number = 20;
  statusInitOffset: number = 10;
  innerPadding: number = 0.25;

  // --- axes ---
  x: any;
  y: any;

  data = [{ "agPositive": false, "igmPositive": false, "iggPositive": false, "n": 749 }, { "agPositive": false, "igmPositive": false, "n": 410 }, { "agPositive": false, "igmPositive": true, "iggPositive": false, "n": 271 }, { "agPositive": false, "igmPositive": false, "iggPositive": true, "n": 167 }, { "agPositive": false, "igmPositive": true, "iggPositive": true, "n": 146 }, { "n": 125 }, { "agPositive": true, "igmPositive": false, "iggPositive": false, "n": 122 }, { "agPositive": false, "igmPositive": true, "n": 60 }, { "agPositive": true, "igmPositive": true, "iggPositive": false, "n": 57 }, { "agPositive": true, "igmPositive": false, "n": 34 }, { "agPositive": false, "n": 26 }, { "agPositive": true, "igmPositive": true, "iggPositive": true, "n": 14 }, { "agPositive": true, "igmPositive": false, "iggPositive": true, "n": 10 }, { "agPositive": true, "n": 10 }, { "agPositive": true, "igmPositive": true, "n": 5 }, { "agPositive": false, "iggPositive": false, "n": 3 }, { "agPositive": true, "iggPositive": false, "n": 2 }, { "agPositive": false, "iggPositive": true, "n": 1 }];

  constructor() { }

  ngOnInit() {
    this.prepData();
  }

  prepData() {
    this.x = d3.scaleBand()
    .rangeRound([0, this.width])
    .paddingInner(this.innerPadding)
    .domain(d3.range(0, this.data.length).map(String));

    this.y = d3.scaleLinear()
    .range([this.height, 0])
    .domain([0, d3.max(this.data, d => d.n)]);

  }

}
