import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router, ParamMap } from '@angular/router';

import { tap, flatMap } from 'rxjs/operators';

import { GetPatientsService, RequestParametersService, AuthService } from '../../_services/';
import { Patient, PatientArray, AuthState, RequestParam, RequestParamArray } from '../../_models';

@Component({
  selector: 'app-filter-patients',
  templateUrl: './filter-patients.component.html',
  styleUrls: ['./filter-patients.component.scss']
})
export class FilterPatientsComponent implements OnInit {
  public patients: Patient[];
  public patientSummary: PatientArray;
  public searchQuery: string = null;
  private authenticated: boolean;
  qString: string;

  // Parameters to set on the first call to the backend (e.g. max values, etc.)
  first_call: boolean = true;
  total_patients: number;
  all_cohorts: string[];
  all_patients: string[];
  all_outcomes: string[];
  all_years: number[];
  all_countries: Object[];


  constructor(private patientSvc: GetPatientsService,
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
          this.requestSvc.patientParamsSubject.next(paramArray);
        }
      })

    // listen for changes in the request parameters.
    this.requestSvc.patientParamsState$.subscribe((qParams: RequestParamArray) => {
      console.log("qParams heard in filter-patients")
      console.log(qParams)

      let http_params = this.requestSvc.reduceParams(qParams);
      console.log(http_params)
      // let param_string: string = this.requestSvc.reduceParams(qParams);
      // console.log(param_string)
      this.patientSvc.getPatientSummary(http_params).subscribe(x => {
        // console.log(x)
        this.patientSummary = x;
      })
    })

    // this.requestSvc.patientParamsState$.pipe(
    // tap((qParams: RequestParamArray) => {
    //   console.log("qParams heard in filter-patients")
    //   console.log(qParams)
    //
    //   this.qString = this.requestSvc.reduceParams(qParams);
    //   console.log(this.qString);
    // }),
    // flatMap(
    //   this.patientSvc.getPatientSummary(this.qString))).subscribe(res => {
    //     console.log("result from patient summary in filter-patients");
    //     console.log(res);
    //   })


    // this.requestSvc.patientParamsState$.subscribe((qParams: RequestParamArray) => {
    //   console.log("qParams heard in filter-patients")
    //   console.log(qParams)
    //
    //   let param_string: string = this.requestSvc.reduceParams(qParams);
    //   console.log(param_string)
    //   this.patientSvc.getPatientSummary(param_string);
    // })

    route.data.subscribe(params => {
      // console.log('Filter getting new summarized data!')
      // console.log(params)
      let pList = params.all;
      this.total_patients = pList.total;
      this.all_patients = pList.patientIDs;
      this.all_cohorts = pList.patientTypes.map(d => d.term);
      this.all_outcomes = pList.patientOutcomes.map(d => d.term);

      // this.all_years = pList.patientYears.filter((d: any) => Number.isInteger(d.term)).map((d: any) => d.term);
      // this.all_years.sort();
      if (this.all_years.length === 0) {
        this.all_years = [2013, 2014, 2015, 2016, 2017, 2018, 2019];
      }

      this.all_countries = pList.patientCountries.map(d => d.term);

      this.patientSummary = params.patients;
      console.log(this.patientSummary)
      console.log(pList)

    });

    this.authSvc.authState$.subscribe((status: AuthState) => {
      this.authenticated = status.authorized;
    })

  }


  ngOnInit() {
  }

  clearFilters() {
    this.searchQuery = null;
    this.requestSvc.patientParamsSubject.next([]);
  }



}
