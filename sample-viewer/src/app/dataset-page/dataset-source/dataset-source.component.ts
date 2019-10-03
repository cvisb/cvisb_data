import { Component, OnInit, Input } from '@angular/core';

import { Source } from '../../_models';

import * as d3 from 'd3';

@Component({
  selector: 'app-dataset-source',
  templateUrl: './dataset-source.component.html',
  styleUrls: ['./dataset-source.component.scss']
})

export class DatasetSourceComponent implements OnInit {
  textColorThreshold: number = 0.5; // threshold for when to switch from black text to white text.
  colorScale: any;
  sourcesPanelState: boolean = true;
  @Input() sources: Source[];

  constructor() { }

  ngOnInit() {
    this.sources = this.sources.sort((a, b) => b.percent - a.percent);
    this.colorScale = d3.scaleSequential(d3.interpolateGreys)
      .domain([0, 1]);
  }

}
