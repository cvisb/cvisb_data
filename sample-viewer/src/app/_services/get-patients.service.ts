import { Injectable } from '@angular/core';

import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError, forkJoin, pipe, of, interval } from 'rxjs';
import { map, catchError, mergeMap, tap, pluck, switchMap, debounce, finalize } from "rxjs/operators";
import { Router, ActivatedRoute } from '@angular/router';

import { environment } from "../../environments/environment";

import { PatientArray, PatientDownload, AuthState, RequestParamArray, PatientSummary, Patient, Sample, ESFacetTerms } from '../_models';
import { AuthService } from './auth.service';
import { ApiService } from './api.service';
import { GetExperimentsService } from './get-experiments.service';
import { RequestParametersService } from './request-parameters.service';
import { MyHttpClient } from './http-cookies.service';
import { DateRangePipe } from "../_pipes/date-range.pipe";

import { flatMapDeep } from 'lodash';

@Injectable({
  providedIn: 'root'
})

export class GetPatientsService {
  qParams: HttpParams;

  // Patient summary counts count
  public patientsSummarySubject = new BehaviorSubject<PatientSummary>(null);
  public patientsSummaryState$ = this.patientsSummarySubject.asObservable();

  // Array of variables to calculate the summary stats for.
  summaryVar: string[] = ["patientID.keyword", "cohort.keyword", "outcome.keyword", "country.identifier.keyword", "infectionYear"];

  constructor(
    public myhttp: MyHttpClient,
    private apiSvc: ApiService,
    private exptSvc: GetExperimentsService,
    private requestSvc: RequestParametersService,
    private datePipe: DateRangePipe,
  ) {
  }

  sortFunc(sortVar: string): string {
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

  /*
  getPatients()

  Combo function that forkJoins (calls both asynchronously) getPatientData and getPatientSummary
  to simultaneously trigger a call to the paginated data function and the summarized facetted object.
   */
  // getPatients(qParams: HttpParams, pageNum: number, pageSize: number, sortVar: string = "", sortDirection: string): Observable<{ patients: Patient[], summary: PatientSummary, total: number }> {
  getPatients(qParams: HttpParams, pageNum: number, pageSize: number, sortVar: string = "", sortDirection: string): Observable<any> {
    return forkJoin([this.getPatientData(qParams, pageNum, pageSize, sortVar, sortDirection), this.getPatientSummary(qParams)]).pipe(
      map(([patientData, patientSummary]) => {
        patientData['summary'] = patientSummary;
        return (patientData)
      })
    )
  }

  loadPatients(pageNum: number, pageSize: number, sortVar: string = "", sortDirection: string): Observable<any> {
    return this.requestSvc.patientParamsState$.pipe(
      // tap(params => console.log(params)),
      tap(params => {
        this.qParams = this.requestSvc.reducePatientParams(params);
      }),
      // debounce(() => interval(5000)),
      switchMap(params => this.getPatients(this.qParams, pageNum, pageSize, sortVar, sortDirection)),
      finalize(() => console.log("finished with get patients service!"))
    )
  }


  /*
  Call to get both patients and their associated experiments/samples for display in the patient table.
  1) Get paginated results for patients.
  2) Use those patientIDs to query /experiment and /sample
  3) Merge the two results together.
   */
  getPatientData(qParams: HttpParams, pageNum: number, pageSize: number, sortVar: string = "",
    sortDirection: string, fields: string[] = ["gID", "sID", "patientID", "alternateIdentifier", "cohort", "outcome", "elisa", "country", "age", "gender", "relatedTo"]): Observable<{ hits: Patient[], total: number }> {
    // ES syntax for sorting is `sort=variable:asc` or `sort=variable:desc`
    // BUT-- Biothings changes the syntax to be `sort=+variable` or `sort=-variable`. + is optional for asc sorts
    let sortString: string = sortDirection === "desc" ? `-${this.sortFunc(sortVar)}` : this.sortFunc(sortVar);

    let patientParams = qParams
      .append('from', (pageSize * pageNum).toString())
      .append('size', pageSize.toString())
      .append('fields', fields.join(","))
      .append("sort", sortString);

    return this.myhttp.get(`${environment.api_url}/api/patient/query`, {
      observe: 'response',
      headers: new HttpHeaders()
        .set('Accept', 'application/json'),
      params: patientParams
    })
      .pipe(
        pluck("body"),
        catchError(e => {
          console.log(e)
          throwError(e);
          return (of(e))
        }),
        mergeMap((patientResults: any[]) => this.getPatientAssociatedData(patientResults['hits'].map(d => d.patientID)).pipe(
          map(associatedData => {
            let patientData = patientResults['hits'];

            patientData.forEach(patient => {
              let patientExpts = flatMapDeep(associatedData['experiments'].filter(d => patient.alternateIdentifier.includes(d.term)), d => d["includedInDataset.keyword"]["terms"]).map(d => d.term);
              patient['availableData'] = patientExpts;
              patient['samples'] = associatedData['samples'].filter(d => patient.alternateIdentifier.includes(d.privatePatientID)).sort((a: Sample, b: Sample) => +a.visitCode - +b.visitCode);
            })

            return ({ hits: patientData, total: patientResults['total'] });
          }),
          catchError(e => {
            console.log(e)
            throwError(e);
            return (of(e))
          })
        )
        )
      )
  }

  /*
  Gets summary, facetted stats for patients
   */
  getPatientSummary(params: HttpParams): Observable<PatientSummary> {
    let facet_string = this.summaryVar.join(",");

    params = params
      .append('facets', facet_string)
      .append("size", "0")
      .append('facet_size', "10000");

    return this.myhttp.get<any[]>(environment.api_url + "/api/patient/query", {
      observe: 'response',
      headers: new HttpHeaders()
        .set('Accept', 'application/json'),
      params: params
    }).pipe(
      pluck("body"),
      map((res: any) => {
        let summary = new PatientSummary(res)
        return (summary);
      }),
      catchError(e => {
        console.log(e);
        return (of(e))
      })
    );
  }

  getAllPatientsSummary(): Observable<PatientSummary> {
    return forkJoin([this.getPatientSummary(new HttpParams().set("q", "__all__")), this.exptSvc.getExptCounts()]).pipe(
      map(([patientSummary, expts]) => {
        patientSummary["experiments"] = expts;

        let years = patientSummary.patientYears.filter((d: any) => Number.isInteger(d.term)).map((d: any) => d.term);
        let minYear = Math.min(...years);
        let maxYear = Math.max(...years);
        patientSummary["yearDomain"] = [minYear, maxYear];
        patientSummary["cohortDomain"] = patientSummary.patientTypes.map(d => d.term);
        patientSummary["outcomeDomain"] = patientSummary.patientOutcomes.map(d => d.term);
        return (patientSummary)
      }),
      catchError(e => {
        console.log(e);
        return (of(e))
      })
    )
  }

  getPatientAssociatedData(ids: string[]): Observable<{ experiments: ESFacetTerms[], samples: Sample[] }> {
    let exptParams = new HttpParams()
      .set("q", "__all__")
      .set("patientID", `"${ids.join('","')}"`)
      .set("facets", "privatePatientID.keyword(includedInDataset.keyword)")
      .set("size", "0")
      .set("facet_size", "10000");

    let sampleParams = new HttpParams()
      .set("q", "__all__")
      .set("size", "1000")
      .set("patientID", `"${ids.join('","')}"`);

    return forkJoin([
      this.myhttp.get<any[]>(environment.api_url + "/api/experiment/query", {
        observe: 'response',
        headers: new HttpHeaders()
          .set('Accept', 'application/json'),
        params: exptParams
      }),
      this.myhttp.get<any[]>(environment.api_url + "/api/sample/query", {
        observe: 'response',
        headers: new HttpHeaders()
          .set('Accept', 'application/json'),
        params: sampleParams
      })]).pipe(
        map(([expts, samples]) => {
          return ({ experiments: expts['body']['facets']['privatePatientID.keyword']['terms'], samples: samples['body']['hits'] })
        })
      )
  }

  /*
  Returns data for an individual patient, to display on its own page.
   */
  getPatientPage(patientID: string, fields: string[] = [""]): Observable<Patient> {
    let patientParams = new HttpParams()
    .set("q", `patientID:"${patientID}"`);
    let patient: Patient;

    return this.getPatientData(patientParams, 0, 2, "", null, fields).pipe(
      tap(data => console.log(data)),
      map(data => {
        if(data.total !== 1){
          throwError(of("More than one patient returned!"))
        } else {
          let patient = data.hits[0];

          // Double check that altID is an array
          if (!Array.isArray(patient.alternateIdentifier)) {
            patient.alternateIdentifier = [patient.alternateIdentifier];
          }

          if (patient.gID && patient.gID.length > 0) {
            patient['patientLabel'] = patient.gID[0];
          } else if (patient.sID) {
            patient['patientLabel'] = patient.sID;
          } else {
            patient['patientLabel'] = patient.patientID;
          }
        }
        console.log(patient)
        return(patient)
      })
    )
  }


  // Using MyGene fetch_all to grab all the data, unscored:
  // https://dev.cvisb.org/api/patient/query?q=__all__&fetch_all=true
  // subsequent calls: https://dev.cvisb.org/api/patient/query?scroll_id=DnF1ZXJ5VGhlbkZldGNoCgAAAAAAANr9FlBCUkVkSkl1UUI2QzdaVlJYSjhRUHcAAAAAAADa_hZQQlJFZEpJdVFCNkM3WlZSWEo4UVB3AAAAAAAA2wUWUEJSRWRKSXVRQjZDN1pWUlhKOFFQdwAAAAAAANsGFlBCUkVkSkl1UUI2QzdaVlJYSjhRUHcAAAAAAADbABZQQlJFZEpJdVFCNkM3WlZSWEo4UVB3AAAAAAAA2v8WUEJSRWRKSXVRQjZDN1pWUlhKOFFQdwAAAAAAANsBFlBCUkVkSkl1UUI2QzdaVlJYSjhRUHcAAAAAAADbAhZQQlJFZEpJdVFCNkM3WlZSWEo4UVB3AAAAAAAA2wMWUEJSRWRKSXVRQjZDN1pWUlhKOFFQdwAAAAAAANsEFlBCUkVkSkl1UUI2QzdaVlJYSjhRUHc=
  // If no more results to be found, "success": false
  // Adapted from https://stackoverflow.com/questions/44097231/rxjs-while-loop-for-pagination
  fetchAllPatients(qParams): Observable<PatientDownload[]> {
    return this.apiSvc.fetchAll("patient", qParams).pipe(
      map((patients) => {
        // console.log("end of API")
        // console.log(patients)
        // last iteration returns undefined; filter out
        // Also call PatientDownload to tidy the results
        patients = patients.map(patient => {
          return (new PatientDownload(patient, this.datePipe));
        })
        return (patients);
      })
    )
  }

}
