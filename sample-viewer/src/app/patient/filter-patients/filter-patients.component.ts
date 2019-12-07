import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router, ParamMap } from '@angular/router';

import { Observable, of, pipe } from 'rxjs';
import { mergeMap, map } from 'rxjs/operators';

import { GetPatientsService, RequestParametersService, AuthService } from '../../_services/';
import { Patient, PatientArray, AuthState, RequestParam, RequestParamArray, PatientSummary, ResolverPatientSummary } from '../../_models';

@Component({
  selector: 'app-filter-patients',
  templateUrl: './filter-patients.component.html',
  styleUrls: ['./filter-patients.component.scss']
})
export class FilterPatientsComponent implements OnInit {
  public patients: Patient[];
  allPatientSummary: PatientSummary;
  public patientSummary$: Observable<PatientSummary>;
  public searchQuery: string = null;
  private authenticated: boolean;
  panelOpenState: boolean = true;
  qString: string;

  constructor(private patientSvc: GetPatientsService,
    private requestSvc: RequestParametersService,
    private route: ActivatedRoute,
    private authSvc: AuthService
  ) {
    // Check if the route contains parameters for filtering
    // ex: "q=country.identifier:(%22SL%22%20%22SL%22)%20AND%20cohort:(%22Lassa%22)%20AND%20patientID:(%22C-fakePatient-0001-1%22)%20OR%20relatedTo:(%22C-fakePatient-0001-1%22)"
    // "q=cohort:(%22Lassa%22%20%22Ebola%22)%20AND%20country.identifier:(%22SL%22)%20AND%20patientID:(%22C-fakePatient-0001-1%22%20%22G-fakePatient-0002%22)%20OR%20relatedTo:(%22C-fakePatient-0001-1%22%20%22G-fakePatient-0002%22)"
    // this.route.queryParams
    //   .subscribe(params => {
    //     // console.log(params)
    //     if (params.hasOwnProperty("q")) {
    //       // parse query string into an array.
    //       let paramArray: RequestParamArray = params.q === "__all__" ? [] : this.requestSvc.splitQuery(params.q);
    //
    //       // console.log(paramArray)
    //       // announce new parameters
    //       this.requestSvc.patientParamsSubject.next(paramArray);
    //     }
    //   })

    // // listen for changes in the request parameters.
    // this.requestSvc.patientParamsState$.subscribe((qParams: RequestParamArray) => {
    //   // console.log("qParams heard in filter-patients")
    //   // console.log(qParams)
    //
    //   let http_params = this.requestSvc.reducePatientParams(qParams);
    //   // console.log(http_params)
    //   // let param_string: string = this.requestSvc.reduceParams(qParams);
    //   // console.log(param_string)
    //   this.patientSvc.getPatientSummary(http_params).subscribe(summary => {
    //     // console.log(x)
    //     this.patientSummary = summary;
    //   })
    // })

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

    this.authSvc.authState$.subscribe((status: AuthState) => {
      this.authenticated = status.authorized;
    })

  }


  ngOnInit() {
    let initial_data: ResolverPatientSummary = this.route.snapshot.data.patients;
    this.allPatientSummary = initial_data.allPatientSummary;
    this.patientSummary$ = of(initial_data.selectedPatientSummary);


    // listen for changes in the request parameters.
    this.patientSummary$ = this.requestSvc.patientParamsState$.pipe(
      mergeMap((qParams: RequestParamArray) => {
        let http_params = this.requestSvc.reducePatientParams(qParams);
        return this.patientSvc.getPatientSummary(http_params);
      })
    ).pipe(
      map(expts => expts)
    )
  }

  clearFilters() {
    this.searchQuery = null;
    this.panelOpenState = true;
    this.requestSvc.patientParamsSubject.next([]);
  }



}
