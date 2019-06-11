import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { RequestParametersService } from '../../_services';

@Component({
  selector: 'app-filter-search',
  templateUrl: './filter-search.component.html',
  styleUrls: ['./filter-search.component.scss']
})

export class FilterSearchComponent implements OnInit {
  @Input() endpoint: string;
  @Input() query: string;

  constructor(private requestSvc: RequestParametersService) { }

  ngOnInit() {
  }

  submitQuery() {
    console.log('submitting query')
    console.log(this.query)
    this.requestSvc.updateParams(this.endpoint, { field: null, value: `"${this.query}"` })
  }

  //   @Output() sharedVarChange = new EventEmitter();
  //   change(newValue) {
  //     console.log('newvalue', newValue)
  //     this.query = newValue;
  //     this.sharedVarChange.emit(newValue);
  //   }

}
