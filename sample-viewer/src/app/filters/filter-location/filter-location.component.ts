import { Component, OnInit, Input } from '@angular/core';

import { GetPatientsService } from '../../_services';
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

  constructor(private patientSvc: GetPatientsService) {
    patientSvc.patientParamsState$.subscribe((params: RequestParamArray) => {
      console.log('getting most recent patient params!')
      console.log(params)
      this.params = params;
    })
   }

  ngOnInit() {
  }

  selectCountry(ctry: string) {
    console.log("Trying to filter country " + ctry);

    switch (this.endpoint) {
      case 'patient': {
        console.log('sending patient endpoint country ' + ctry);

        this.params.push({field: 'country.identifier', value: ctry});
        this.params = [{field: 'country.identifier', value: ctry}];
        console.log(this.params);

        this.patientSvc.patientParamsSubject.next(this.params);
        break;
      }
      case 'dataset': {
        console.log('sending dataset endpoint country ' + ctry);
        break;
      }
      default: {
        console.log("ERROR! Unknown endpoint to be filtered.")
        break;
      }
    }
  }

}
