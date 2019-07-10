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
    console.log(this.data)
  }


  filterHandler(params, filterSvc, requestSvc, endpoint) {
    console.log("Calling filter handler in years!")
    console.log(params)
    requestSvc.updateParams(endpoint, { field: 'infectionYear', value:  `[${params.term} TO ${params.term}]` });

    //   params.term === "unknown" ?
    //        filterSubject.next({ lower: 0, upper: 0, unknown: true }) :
    //        filterSubject.next({ lower: d.term, upper: d.term, unknown: false });
    //
    //      // update parameters.
    //      sendParams(filterSubject, requestSvc, endpoint);
    // }
  }
}
