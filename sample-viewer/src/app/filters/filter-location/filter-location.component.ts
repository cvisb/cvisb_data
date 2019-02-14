import { Component, OnInit, Input } from '@angular/core';

import { RequestParametersService } from '../../_services';
import { RequestParam } from '../../_models';

@Component({
  selector: 'app-filter-location',
  templateUrl: './filter-location.component.html',
  styleUrls: ['./filter-location.component.scss']
})

export class FilterLocationComponent implements OnInit {
  @Input() countries;
  @Input() endpoint: string;

  constructor(private requestSvc: RequestParametersService) {
   }

  ngOnInit() {
  }

  selectCountry(ctry: string) {
    this.requestSvc.updateParams(this.endpoint, { field: 'country.identifier', value: ctry })
  }

}
