import { Component, OnInit, OnChanges, AfterViewInit, Input, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';

import * as d3 from 'd3';

import { Observable, Subject, BehaviorSubject, throwError } from 'rxjs';

import { RequestParametersService } from '../../_services';
import { D3Nested, RequestParam, RequestParamArray } from '../../_models';

@Component({
  selector: 'app-filter-sample-year',
  templateUrl: './filter-sample-year.component.html',
  styleUrls: ['./filter-sample-year.component.scss']
})

export class FilterSampleYearComponent implements OnInit {
  // data
  @Input() public data: D3Nested[];
  @Input() public yearDomain: number[];
  @Input() public endpoint: string;

  public filterSubject: BehaviorSubject<Object> = new BehaviorSubject<Object>(null);
  public filterState$ = this.filterSubject.asObservable();

  filter_title: string = "Initial Evaluation Date";

  constructor(private requestSvc: RequestParametersService) {
  }

  ngOnInit() {
  }

}
