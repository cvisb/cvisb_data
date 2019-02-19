import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router, ParamMap } from '@angular/router';

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

  // Parameters to set on the first call to the backend (e.g. max values, etc.)
  first_call: boolean = true;
  total_patients: number;
  total_cohorts: string[];
  total_outcomes: string[];
  total_years: number[];


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
        console.log(params)
        // parse query string into an array.
        let query_string = params.q;



        let paramArray: RequestParamArray = this.splitQuery(params.q);
        console.log(paramArray)
        // announce new parameters
        this.requestSvc.patientParamsSubject.next(paramArray);
      })

    // grab the data
    this.patientSvc.patientsState$.subscribe((pList: PatientArray) => {
      if (pList) {
        this.patients = pList.patients;
        this.patientSummary = pList;

        // On the initial return object, set the maximum parameters
        if (this.first_call) {
          this.first_call = false;
          this.total_patients = this.patients.length;
          this.total_cohorts = pList.patientTypes.map((d: any) => d.key);
          this.total_outcomes = pList.patientOutcomes.map((d: any) => d.key);
          this.total_years = pList.patientOutcomes.map((d: any) => {
            if (Number.isInteger(d)) return (d.key);
          }
          );
          console.log(this.total_years)
          console.log(this.total_cohorts)
          console.log(this.total_outcomes)
        }
      }
    });

    this.authSvc.authState$.subscribe((status: AuthState) => {
      this.authenticated = status.authorized;
    })

  }

  ngOnInit() {
    console.log(this.patients)
  }

  clearFilters() {
    this.searchQuery = null;
    this.requestSvc.patientParamsSubject.next([]);
  }

  splitQuery(query_string: string): RequestParamArray {
    // split into individual params by ` AND `
    let query_array = query_string.split("%20AND%20");

    // for each couplet:
    // 1. split into orStatements
    // 2. split into field/values
    // 3. remove `()`, `""`
    // 4. split values into array.
    let paramArray: RequestParamArray = [];
    for (let query of query_array) {
      paramArray.push(this.splitParamString(query))
    }
    return (paramArray);
  }


  splitParamString(param_string: string): RequestParam {
    // split into OR statements.
    let str_array = param_string.split("%20OR%20");

    if (str_array.length === 1) {
      return (this.splitPieces(str_array[0]));
    } else {
      let arr = this.splitPieces(str_array[0]);
      let or_arr = this.splitPieces(str_array[1]);
      arr['orStatement'] = or_arr
      return (arr);
    }
  }

  splitPieces(param_string: string): RequestParam {
    // split into field / values
    let vals = param_string.split(":");
    // remove `""` and `()`
    // split values by space `%20` into array
    let values = vals[1].replace(/%22/g, "").replace(/\(/g, "").replace(/\)/g, "").split("%20")

    return ({ field: vals[0], value: values });
  }


}
