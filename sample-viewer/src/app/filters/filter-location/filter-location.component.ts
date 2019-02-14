import { Component, OnInit, Input } from '@angular/core';

import { RequestParametersService } from '../../_services';
import { RequestParam, RequestParamArray } from '../../_models';

@Component({
  selector: 'app-filter-location',
  templateUrl: './filter-location.component.html',
  styleUrls: ['./filter-location.component.scss']
})

export class FilterLocationComponent implements OnInit {
  @Input() countries;
  @Input() endpoint: string;
  params: RequestParamArray;

  constructor(private requestSvc: RequestParametersService) {
    requestSvc.patientParamsState$.subscribe((params: RequestParamArray) => {
      this.params = params;
    })
   }

  ngOnInit() {
  }

  selectCountry(ctry: string) {
    this.requestSvc.updateParams(this.endpoint, { field: 'country.identifier', value: ctry })
    // switch (this.endpoint) {
    //   case 'patient': {
    //     this.params.push({field: 'country.identifier', value: ctry});
    //     this.params = [{field: 'country.identifier', value: ctry}];
    //
    //     this.requestSvc.patientParamsSubject.next(this.params);
    //     break;
    //   }
    //   case 'dataset': {
    //     console.log('sending dataset endpoint country ' + ctry);
    //     break;
    //   }
    //   default: {
    //     console.log("ERROR! Unknown endpoint to be filtered.")
    //     break;
    //   }
    // }
  }

}
