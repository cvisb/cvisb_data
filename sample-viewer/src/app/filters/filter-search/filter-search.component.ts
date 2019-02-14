import { Component, OnInit, Input } from '@angular/core';

import { RequestParametersService } from '../../_services';

@Component({
  selector: 'app-filter-search',
  templateUrl: './filter-search.component.html',
  styleUrls: ['./filter-search.component.scss']
})

export class FilterSearchComponent implements OnInit {
  @Input() endpoint: string;
  query: string;

  constructor(private requestSvc: RequestParametersService) { }

  ngOnInit() {
  }

  submitQuery() {
    console.log('submitting query')
    console.log(this.query)
    this.requestSvc.updateParams(this.endpoint, { field: null, value: this.query })

  }

}
