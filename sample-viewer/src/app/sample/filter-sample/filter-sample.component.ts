import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router, ParamMap } from '@angular/router';

import { GetSamplesService, RequestParametersService, AuthService } from '../../_services/';
import { AuthState, RequestParam, RequestParamArray } from '../../_models';


@Component({
  selector: 'app-filter-sample',
  templateUrl: './filter-sample.component.html',
  styleUrls: ['./filter-sample.component.scss']
})

export class FilterSampleComponent implements OnInit {
  public searchQuery: string = null;
  authenticated: boolean;
  patients: string[];
  all_patients: string[];
  sample_count: number;
  total_samples: number;

  first_call: boolean = true;

  constructor(
    private sampleSvc: GetSamplesService,
    private requestSvc: RequestParametersService,
    private route: ActivatedRoute,
    private authSvc: AuthService
  ) {
    // Check if the route contains parameters for filtering
    // ex: "q=country.identifier:(%22SL%22%20%22SL%22)%20AND%20cohort:(%22Lassa%22)%20AND%20patientID:(%22C-fakePatient-0001-1%22)%20OR%20relatedTo:(%22C-fakePatient-0001-1%22)"
    // "q=cohort:(%22Lassa%22%20%22Ebola%22)%20AND%20country.identifier:(%22SL%22)%20AND%20patientID:(%22C-fakePatient-0001-1%22%20%22G-fakePatient-0002%22)%20OR%20relatedTo:(%22C-fakePatient-0001-1%22%20%22G-fakePatient-0002%22)"
    this.route.queryParams
      .subscribe(params => {
        // console.log(params)
        if (params.hasOwnProperty("q")) {
          // parse query string into an array.
          let paramArray: RequestParamArray = params.q === "__all__" ? [] : this.requestSvc.splitQuery(params.q);

          // console.log(paramArray)
          // announce new parameters
          // this.requestSvc.patientParamsSubject.next(paramArray);
        }
      })

    // // grab the data
    this.sampleSvc.samplesState$.subscribe((sList) => {
      if (sList) {
        this.sample_count = sList.length;
        this.patients = sList.map((d:any) => d.privatePatientID);
        // this.patientSummary = pList;

        // On the initial return object, set the maximum parameters
        if (this.first_call) {
          this.first_call = false;
          this.total_samples = sList.length;
          this.all_patients = sList.map((d:any) => d.privatePatientID);
          // this.all_cohorts = pList.patientTypes.map((d: any) => d.key);
          // this.all_outcomes = pList.patientOutcomes.map((d: any) => d.key);
          // this.all_years = pList.patientYears.filter((d:any) => Number.isInteger(d.key)).map((d: any) => d.key);
          // this.all_years.sort();
          // this.all_countries = pList.patientCountries;
          // console.log(this.all_countries)
          // console.log(this.all_cohorts)
          // console.log(this.all_outcomes)
        }
      }
    });

    this.authSvc.authState$.subscribe((status: AuthState) => {
      this.authenticated = status.authorized;
    })

  }


  ngOnInit() {
  }

  clearFilters() {
    this.searchQuery = null;
    this.requestSvc.sampleParamsSubject.next([]);
  }

}
