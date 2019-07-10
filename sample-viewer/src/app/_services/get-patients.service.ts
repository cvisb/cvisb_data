import { Injectable } from '@angular/core';

import { HttpHeaders, HttpParams } from '@angular/common/http';
import { map, catchError, mergeMap } from "rxjs/operators";
import { Observable, Subject, BehaviorSubject, throwError } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';

import { environment } from "../../environments/environment";

import { Patient, PatientArray, PatientDownload, AuthState, RequestParamArray, RequestParam, PatientSummary, ESResponse } from '../_models';
import { AuthService } from './auth.service';
import { ApiService } from './api.service';
import { RequestParametersService } from './request-parameters.service';
import { MyHttpClient } from './http-cookies.service';

// import PATIENTS from '../../assets/data/patients.json';


@Injectable({
  providedIn: 'root'
})

export class GetPatientsService {
  // patients: Patient[];
  request_params: RequestParamArray;

  all_data;

  // Event listener for the patient array.
  public patientsSubject: BehaviorSubject<PatientArray> = new BehaviorSubject<PatientArray>(null);
  public patientsState$ = this.patientsSubject.asObservable();

  // Array of variables to calculate the summary stats for.
  summaryVar: string[] = ["patientID.keyword", "cohort.keyword", "outcome.keyword", "country.identifier.keyword", "infectionYear"];

  constructor(
    public myhttp: MyHttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private apiSvc: ApiService,
    private requestSvc: RequestParametersService,
    private authSvc: AuthService) {

    // this.apiSvc.put('patient', [this.fakePatients[1]]);

    this.authSvc.authState$.subscribe((authState: AuthState) => {
      if (authState.authorized) {
        // this.getPatients();
      }
    })

    // this.requestSvc.patientParamsState$.subscribe((params: RequestParamArray) => {
    //   console.log(params)
    //   this.request_params = params;
    //   // this.getPatients();
    // })



    // this.patients.sort((a: any, b: any) => (a.availableData && b.availableData) ? (b.availableData.length - a.availableData.length) : (a.patientID < b.patientID ? -1 : 1));
    // this.patients.sort((a: any, b: any) => this.sortFunc(a, b));
  }

  sortFunc(sortVar): string {
    // Sorting func for ES.

    let numericVars = ["age"];
    if (numericVars.includes(sortVar) || !sortVar) {
      return (sortVar);
    }

    // custom: nested objects
    if (sortVar === "country") {
      return ("country.name.keyword");
    }

    // Default: string
    // Since any variable which is a string has to be sorted by keyword, doing a bit of transformation:
    return (`${sortVar}.keyword`);
  }


  getPatient(id: string): any {
    // temp hard-coded shim.
    // return (this.patients.filter((d: any) => d.patientID === id)[0]);
    return this.apiSvc.getOne('patient', id, 'patientID')
  }

  /*
  Call to get both patients and their associated experiments.
  1) Get paginated results for patients.
  2) Use those patientIDs to query /experiment
  3) Merge the two results together.
   */
  getPatients(qParams: HttpParams, pageNum: number, pageSize: number, sortVar: string = "", sortDirection: string) {

    // ES syntax for sorting is `sort=variable:asc` or `sort=variable:desc`
    // BUT-- Biothings changes the syntax to be `sort=+variable` or `sort=-variable`. + is optional for asc sorts
    let sortString: string = sortDirection === "desc" ? `-${this.sortFunc(sortVar)}` : this.sortFunc(sortVar);

    let params = qParams
      .append('size', pageSize.toString())
      .append('from', (pageSize * pageNum).toString())
      .append("sort", sortString);

    return this.myhttp.get<any[]>(environment.api_url + "/api/patient/query", {
      observe: 'response',
      headers: new HttpHeaders()
        .set('Accept', 'application/json'),
      params: params
    }).pipe(
      mergeMap(patientResults => this.myhttp.get<any[]>(environment.api_url + "/api/experiment/query", {
        observe: 'response',
        headers: new HttpHeaders()
          .set('Accept', 'application/json'),
        params: new HttpParams()
          .set("q", "__all__")
          .set("patientID", `"${patientResults['body']['hits'].map(d => d.patientID).join('","')}"`)
          .set("facets", "privatePatientID.keyword(measurementTechnique.keyword)")
      }).pipe(
        map(expts => {
          console.log('inner call!')
          let patients = patientResults['body']['hits'];

          patients.forEach(patient => {
            let patientExpts = expts['body']["facets"]["privatePatientID.keyword"]["terms"].filter(d => patient.alternateIdentifier.includes(d.term)).flatMap(d => d["measurementTechnique.keyword"]["terms"].map(d => d.term));
            patient['availableData'] = patientExpts;
          })
          console.log(patients)
          console.log(expts)

          return ({ hits: patients, total: patientResults['body']['total'] });
        }),
        catchError(e => {
          console.log(e)
          throwError(e);
          return (new Observable<any>())
        })
      )
      )
    )



    // QUERY 1: get patients
    // return this.myhttp.get<any[]>(environment.api_url + "/api/patient/query", {
    //   observe: 'response',
    //   headers: new HttpHeaders()
    //     .set('Accept', 'application/json'),
    //   params: qParams.append("size", "10")
    // }).pipe(
    //   // return this.apiSvc.getPaginated('patient', qParams, pageNum, pageSize, sortVar, sortDirection).pipe(
    //   mergeMap(patientResults =>
    //     // ex: https://dev.cvisb.org/api/experiment/query?q=__all__&size=0&patientID=%22G13-358327%22&facets=privatePatientID.keyword(measurementTechnique.keyword)
    //     // QUERY 2: get expts associated with those patients
    //     this.myhttp.get<any[]>(`${environment.api_url}/api/experiment/query`, {
    //       observe: 'response',
    //       headers: new HttpHeaders()
    //         .set('Accept', 'application/json'),
    //       params: new HttpParams()
    //         .set("q", "__all__")
    //         .set("patientID", `"${patientResults['body']['hits'].join('","')}"`)
    //         .set("facets", "privatePatientID.keyword(measurementTechnique.keyword)")
    //     })
    //
    //       // mergeMap(patientResults => {
    //       //   let patients = patientResults['body']['hits'];
    //       //   // ex: https://dev.cvisb.org/api/experiment/query?q=__all__&size=0&patientID=%22G13-358327%22&facets=privatePatientID.keyword(measurementTechnique.keyword)
    //       //   // QUERY 2: get expts associated with those patients
    //       //   let patientIDs = patients.map(d => d.patientID);
    //       //   console.log(patientIDs);
    //       //
    //       //   let exptParams = new HttpParams()
    //       //     .set("q", "__all__")
    //       //     .set("patientID", `"${patientIDs.join('","')}"`)
    //       //     .set("facets", "privatePatientID.keyword(measurementTechnique.keyword)");
    //       //
    //       //   return this.myhttp.get<any[]>(`${environment.api_url}/api/experiment/query`, {
    //       //     observe: 'response',
    //       //     headers: new HttpHeaders()
    //       //       .set('Accept', 'application/json'),
    //       //     params: exptParams
    //       //   })
    //       .pipe(
    //         map(expts => {
    //           let patients = patientResults['body']['hits'];
    //
    //           patients.forEach(patient => {
    //             let patientExpts = expts["facets"]["privatePatientID.keyword"]["terms"].filter(d => patient.alternateIdentifier.includes(d.term)).flatMap(d => d["measurementTechnique.keyword"]["terms"].map(d => d.term));
    //             console.log(patientExpts);
    //             patient['availableData'] = patientExpts;
    //           })
    //
    //           console.log(patients)
    //           console.log(expts)
    //
    //           return patients;
    //         })
    //       )
    //   )
    // )
  }


  /*
  Gets summary, facetted stats for patients
   */
  getPatientSummary(params: HttpParams): Observable<any> {
    let facet_string = this.summaryVar.join(",");

    params = params
      .append('facets', facet_string)
      .append('facet_size', "10000")
      .append('size', "0");

    return this.myhttp.get<any[]>(`${environment.api_url}/api/patient/query`, {
      observe: 'response',
      headers: new HttpHeaders()
        .set('Accept', 'application/json'),
      params: params
    }).pipe(
      map((res: ESResponse) => {
        console.log(res);
        let summary = new PatientSummary(res.body)
        // console.log(summary)
        return (summary);
      }
      )
    );
  }

  getAllPatientsSummary(): Observable<any> {
    return (this.getPatientSummary(new HttpParams().set("q", "__all__")));
  }


  // Using MyGene fetch_all to grab all the data, unscored:
  // https://dev.cvisb.org/api/patient/query?q=__all__&fetch_all=true
  // subsequent calls: https://dev.cvisb.org/api/patient/query?scroll_id=DnF1ZXJ5VGhlbkZldGNoCgAAAAAAANr9FlBCUkVkSkl1UUI2QzdaVlJYSjhRUHcAAAAAAADa_hZQQlJFZEpJdVFCNkM3WlZSWEo4UVB3AAAAAAAA2wUWUEJSRWRKSXVRQjZDN1pWUlhKOFFQdwAAAAAAANsGFlBCUkVkSkl1UUI2QzdaVlJYSjhRUHcAAAAAAADbABZQQlJFZEpJdVFCNkM3WlZSWEo4UVB3AAAAAAAA2v8WUEJSRWRKSXVRQjZDN1pWUlhKOFFQdwAAAAAAANsBFlBCUkVkSkl1UUI2QzdaVlJYSjhRUHcAAAAAAADbAhZQQlJFZEpJdVFCNkM3WlZSWEo4UVB3AAAAAAAA2wMWUEJSRWRKSXVRQjZDN1pWUlhKOFFQdwAAAAAAANsEFlBCUkVkSkl1UUI2QzdaVlJYSjhRUHc=
  // If no more results to be found, "success": false
  getPatientRoster(qParams): Observable<Patient[]> {
    this.all_data = [];

    console.log(qParams);

    let params = qParams
      .append('fetch_all', "true");

    return this.myhttp.get<any[]>(`${environment.api_url}/api/patient/query`, {
      observe: 'response',
      headers: new HttpHeaders()
        .set('Accept', 'application/json'),
      params: params
    }).pipe(
      map((res: Patient[]) => {
        console.log(res);

        let patientArray = res["body"]['hits'].map(patient => {
          return (new PatientDownload(patient));
        });

        return (patientArray)
      }
      )
    );

    // this.myhttp.get('./customer.json').map((res: Response) => res.json())
    //            .mergeMap(customer => this.myhttp.get(customer.contractUrl))
    //            .map((res: Response) => res.json())
    //            .subscribe(res => this.contract = res);


    // this.myhttp.get<any[]>(environment.api_url + "/api/patient/query?q=__all__&fetch_all=true", {
    //   observe: 'response',
    //   headers: new HttpHeaders()
    //     .set('Accept', 'application/json')
    // }).subscribe(data => {
    //   console.log(data);
    //   if (data['body']['success'] !== false) {
    //     let patients = data['body']['hits'];
    //     let scroll_id = data['body']['_scroll_id'];
    //   }
    // },
    //   err => {
    //     console.log('Error in getting patients')
    //     console.log(err)
    //   })
  }

  fetchAll() {
    return this.myhttp.get<any[]>(`${environment.api_url}/api/patient/query`, {
      observe: 'response',
      headers: new HttpHeaders()
        .set('Accept', 'application/json'),
      params: new HttpParams()
        .set('q', '__all__')
        .set('fetch_all', 'true')
    }).pipe(
      map((res: Patient[]) => {
        console.log(res);
        return (new Array<PatientDownload>(res["body"]));
      }
      )
    )
  }

  fetchNext(scroll_id: string) {
    return this.myhttp.get<any[]>(`${environment.api_url}/api/patient/query`, {
      observe: 'response',
      headers: new HttpHeaders()
        .set('Accept', 'application/json'),
      params: new HttpParams()
        .set('_scroll_id', scroll_id)
    }).pipe(
      map(res => {
        console.log(res);
        return (res["body"])
      }
      )
    )
  }


}
