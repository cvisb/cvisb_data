import { Component, OnInit, Input } from '@angular/core';

import { D3Nested } from '../../_models';

@Component({
  selector: 'app-filter-experiment',
  templateUrl: './filter-experiment.component.html',
  styleUrls: ['./filter-experiment.component.scss']
})
export class FilterExperimentComponent implements OnInit {

  @Input() expts: D3Nested[];

  constructor() { }

  ngOnInit() {
  }

}
