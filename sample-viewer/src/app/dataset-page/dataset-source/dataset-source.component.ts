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
  expansionPanelHeight: string = "42px";
  @Input() sources: Source[];
  sources_left: Source[] = [];
  sources_right: Source[] = [];

  constructor() { }

  ngOnInit() {
    this.sources = this.sources.sort((a, b) => b.percent - a.percent);
    let sources_length = this.sources.length;
    if(sources_length > 4) {
      this.sources_left = this.sources.slice(0, Math.ceil(sources_length/2));
      this.sources_left = this.sources.slice(Math.floor(sources_length/2), sources_length);
    } else {
      this.sources_left = this.sources;
    }
    this.colorScale = d3.scaleSequential(d3.interpolateGreys)
      .domain([0, 1]);
  }

}
