import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map, catchError, mergeMap, tap, flatMap } from "rxjs/operators";
import { Observable, Subject, BehaviorSubject, throwError, forkJoin, of, from } from 'rxjs';

import { ActivatedRoute } from '@angular/router';

import * as d3 from 'd3';

import { environment } from "../../environments/environment";
import { Sample, SampleWide, AuthState, RequestParamArray, Patient } from '../_models/';
import { AuthService } from './auth.service';
import { MyHttpClient } from './http-cookies.service';
import { RequestParametersService } from './request-parameters.service';

@Injectable({
  providedIn: 'root'
})

export class GetSamplesService {
  request_params: RequestParamArray;

  // Event listeners to pass data.
  private samples_wide: SampleWide[] = [];
  public samplesSubject: BehaviorSubject<Object[]> = new BehaviorSubject<Object[]>(null);
  public samplesWideSubject: BehaviorSubject<Object[]> = new BehaviorSubject<Object[]>([]);
  public samplesState$ = this.samplesSubject.asObservable();
  public samplesWideState$ = this.samplesWideSubject.asObservable();

  samplePatientMD: Patient[] = [];


  constructor(
    public myhttp: MyHttpClient,
    private requestSvc: RequestParametersService,
    private route: ActivatedRoute,
    private authSvc: AuthService) {

    this.authSvc.authState$.subscribe((authState: AuthState) => {
      if (authState.authorized) {
        this.getSamples();
      }
    })

    this.requestSvc.sampleParamsState$.subscribe((params: RequestParamArray) => {
      console.log("Re-getting samples with new parameters:")
      console.log(params)
      this.request_params = params;
      this.getSamples();
    })

    // this.getSamplePatientData().subscribe(patients => {
    //   console.log("Saving all samplePatientMD")
    //   this.samplePatientMD = patients;
    // })

  }

  getSampleCount(qParams?): Observable<any> {
    // If unspecified, set q string to return all.
    qParams = qParams ? qParams : new HttpParams().set("q", "__all__");

    let params = qParams
      .append('size', 0)
      .append("facet_size", 10000)
      .append("facets", "privatePatientID.keyword");

    return this.myhttp.get<any[]>(`${environment.api_url}/api/sample/query`, {
      observe: 'response',
      headers: new HttpHeaders()
        .set('Accept', 'application/json'),
      params: params
    }).pipe(
      map(res => {
        console.log(res);
        return (res["body"]["facets"]["privatePatientID.keyword"].terms)
      }),
      catchError(e => {
        return of(e);
      })
    );
  }

  getSamplePatientFacet(facetVar: string = "cohort", qParams?): Observable<any> {
    // https://dev.cvisb.org/api/patient/query?q=__all__&sampleQuery=*&facets=alternateIdentifier.keyword(cohort.keyword)&facet_size=1000&size=0
    // If unspecified, set q string to return all.
    qParams = qParams ? qParams : new HttpParams().set("q", "__all__");

    let params = qParams
      .append('size', 0)
      .append("facet_size", 10000)
      .append("sampleQuery", (`*&facets=alternateIdentifier.keyword(${facetVar}.keyword)`));

    console.log(params);

    return this.myhttp.get<any[]>(`${environment.api_url}/api/patient/query`, {
      observe: 'response',
      headers: new HttpHeaders()
        .set('Accept', 'application/json'),
      params: params
    }).pipe(
      map(res => {
        console.log(res);
        return (res["body"]["facets"]["alternateIdentifier.keyword"].terms)
      }),
      catchError(e => {
        return of(e);
      })
    );
  }

  getSamplePatientData(qParams?): Observable<any> {
    // NOTE: will fail for results > 1000
    // https://dev.cvisb.org/api/patient/query?q=__all__&sampleQuery=*&facets=alternateIdentifier.keyword(cohort.keyword)&facet_size=1000&size=0
    // If unspecified, set q string to return all.
    qParams = qParams ? qParams : new HttpParams().set("q", "__all__");

    let params = qParams
      .append('size', 1000)
      .append("sampleQuery", (`_exists_:privatePatientID`));

    return this.myhttp.get<any[]>(`${environment.api_url}/api/patient/query`, {
      observe: 'response',
      headers: new HttpHeaders()
        .set('Accept', 'application/json'),
      params: params
    }).pipe(
      map(res => {
        console.log(res);
        this.samplePatientMD = res["body"]["hits"];
        return (res["body"]["hits"])
      }),
      catchError(e => {
        return of(e);
      })
    );
  }


  getSampleSummary(qParams?) {
    return forkJoin(this.getSampleCount(qParams),
      this.getSamplePatientData(qParams)
      // return forkJoin(this.getSampleCount(qParams),
      // this.getSamplePatientFacet("cohort", qParams),
      // this.getSamplePatientFacet("outcome", qParams)
    )
    // .pipe(map(([sampleCounts, cohorts, outcomes]) => {
    //     console.log(sampleCounts)
    //     console.log(cohorts)
    //     console.log(outcomes)
    //     return([])
    //   })
    // )

  }

  //
  //     //
  //     this.myhttp.get<any[]> (environment.api_url + "/api/sample/" + id, {
  //       // this.myhttp.get<any[]>(environment.host_url + "/api/sample/test_2", {
  //       observe: 'response',
  //       headers: new HttpHeaders()
  //         .set('Accept', 'application/json')
  //     }).subscribe(data => {
  //       console.log(data)
  //       return (data.body)
  //     },
  //       err => {
  //         console.log(err)
  //       })
  //   }
  //
  // https://dev.cvisb.org/api/patient/query?q=__all__&facets=alternateIdentifier.keyword(cohort.keyword)&size=0&facet_size=10000
  //
  //   }

  getSample(id: string) {
    this.myhttp.get<any[]>(environment.api_url + "/api/sample/" + id, {
      // this.myhttp.get<any[]>(environment.host_url + "/api/sample/test_2", {
      observe: 'response',
      headers: new HttpHeaders()
        .set('Accept', 'application/json')
    }).subscribe(data => {
      console.log(data)
    },
      err => {
        console.log(err)
      })
  }


  getSamples() {
    console.log('calling get samples')
    // if (this.samplePatientMD.length === 0) {
    this.getSamplePatientData().pipe(mergeMap(patients => this.getNPrepSamples()))
    // this.getSamplePatientData().pipe(
    //   tap(e => console.log(e)),
    //   mergeMap(e => console.log(e))
    // )
    //
    // this.getSamplePatientData().pipe(
    //   map(x => console.log(x)),
    //   mergeMap(n => this.getNPrepSamples().pipe(
    //     console.log(n)
    //   )),
    //   catchError(err => of('error found')),
    // ).subscribe(console.log('fsdjk'));

    // } else {
    //   this.getNPrepSamples();
    // }
    //
    this.getSamplePatientData()
    .pipe(flatMap(firstMethodResult => this.getNPrepSamples()))
    .subscribe(thirdMethodResult => {
          console.log(thirdMethodResult);
     });

  }

  getNPrepSamples() {
    let param_string = this.requestSvc.reduceParams(this.request_params);
    param_string = param_string.set('size', "1000")

    return this.myhttp.get<any[]>(`${environment.api_url}/api/sample/query`, {
      observe: 'response',
      headers: new HttpHeaders()
        .set('Accept', 'application/json'),
      params: param_string
    }).pipe(
      map(data => {
        let samples = data['body']['hits'];
        console.log(data)
        if (samples) {
          console.log(this.samplePatientMD)
          samples.forEach(d => {
            let filtered = this.samplePatientMD.filter(patient => patient.alternateIdentifier.includes(d.privatePatientID));

            if (filtered.length === 1) {
              d['patientID'] = filtered[0].patientID;
              d['cohort'] = filtered[0].cohort;
              d['outcome'] = filtered[0].outcome;
              d['country'] = filtered[0].country['name'];
              d['infectionYear'] = filtered[0].infectionYear;
              // d['elisa'] = filtered[0].elisa;
            }
          })

          this.samplesSubject.next(samples);

          // Grab the sample locations and data and reshape to display in the table.
          this.nestSamples(samples);
          this.samplesWideSubject.next(this.samples_wide);
          return(samples)
        } else {
          console.log('Error in getting samples')
          this.samplesSubject.next(samples);
          console.log(data)
        }
      }),
      catchError(e => {
        return of(e);
      })
    )
  }

  nestSamples(samples) {

    // Update function: either creates an array of unique values, or a single value.
    let updateSet = function(prev, curr, variable) {
      let return_val;
      if (prev[variable]) {
        return_val = prev[variable];
        if (prev[variable] !== curr[variable] && !prev[variable].includes(curr[variable])) {

          Array.isArray(return_val) ? null :
            return_val = [return_val];
          return_val.push(curr[variable]);
        }
      } else {
        return_val = curr[variable];
      }
      return (return_val)
    }

    console.log(samples)

    // Converts the long table into a wide one, with patientID, privatePatientID, and visitCode pulled out to the highest level
    // Each sample type is an array containing the sample locations + associated metadata.
    this.samples_wide = d3.nest()
      .key((d: any) => d.privatePatientID + String(d.visitCode))
      // 	.key(d => d.sampleType)
      .rollup(function(d: any) { // do this to each grouping
        // reduce takes a list and returns one value
        // in this case, the list is all the grouped elements
        // and the final value is an object with keys
        return d.reduce(function(prev, curr) {
          // If it already exists-- append
          // If not-- create it as an array/set (for unique values)
          prev["privatePatientID"] = updateSet(prev, curr, "privatePatientID");
          prev["visitCode"] = updateSet(prev, curr, "visitCode");

          prev[curr["sampleType"]] ? prev[curr["sampleType"]].push(curr) : prev[curr["sampleType"]] = [curr];
          return prev;
        }, {});
      })
      .entries(samples)
      .map((d) => d.value);

    console.log(this.samples_wide)

    // For each sample type, nest the locations together. Key = sample ID; values = array of locations + metadata.
    // let sample_types = Array.from(new Set(samples.map(d => d.sampleType)));
    // this.samples_wide.forEach(patientGroup => {
    //
    //   sample_types.forEach((type: any) => {
    //     if (patientGroup[type]) {
    //       patientGroup[type] = d3.nest()
    //         .key((d: any) => d.sampleID)
    //         .entries(patientGroup[type])
    //     }
    //   })
    // })

    // console.log(this.samples_wide)

    //
    //

    // // Splay out wide by patient ID.
    // this.samples_wide = d3.nest()
    //   .key((d: any) => (d.privatePatientID + String(d.visitCode)))
    //   // .key((d: any) => d.visitCode)
    //   .rollup(function(v: any): any {
    //     return {
    //       count: v.length,
    //       patientID: v[0].patientID,
    //       privatePatientID: v[0].privatePatientID,
    //       visitCode: v[0].visitCode,
    //       // patient_type: v[0].patient_type,
    //       // patient_cohort: v[0].patient_cohort,
    //       all_data: v.map(d => d)
    //     };
    //   })
    //   .entries(samples);

    // for (let i = 0; i < this.samples_wide.length; i++) {
    //   let row = this.samples_wide[i];
    //   let row_vals = row['value'].all_data;
    //   let arr = [];
    //
    //   for (let j = 0; j < row_vals.length; j++) {
    //     let stype = row_vals[j].sampleType;
    //     // console.log(stype)
    //     // let stype_idx = row.findIndex(d => stype === );
    //     if (row.hasOwnProperty(stype)) {
    //       this.samples_wide[i][stype]['location'].push({ 'lab': row_vals[j]['lab'], 'numAliquots': row_vals[j]['numAliquots'], 'updated': row_vals[j]['updated'], 'updatedBy': row_vals[j]['updatedBy'] });
    //     } else {
    //       let indiv_sample = {
    //         'sampleID': row_vals[j]['sampleID'],
    //         'dilutionFactor': row_vals[j]['dilutionFactor'],
    //         'freezingBuffer': row_vals[j]['freezingBuffer'],
    //         'isolationDate': row_vals[j]['isolationDate'],
    //         'species': row_vals[j]['species'],
    //         'protocol': row_vals[j]['protocol'],
    //         'sourceSampleID': row_vals[j]['sourceSampleID'],
    //         'sampleType': row_vals[j]['sampleType'],
    //         'location': [{ 'lab': row_vals[j]['lab'], 'numAliquots': row_vals[j]['numAliquots'], 'updated': row_vals[j]['updated'], 'updatedBy': row_vals[j]['updatedBy'] }]
    //       };
    //
    //       this.samples_wide[i][stype] = indiv_sample;
    //     }
    //   }
    // }
    // console.log(this.samples_wide)
    // let arr_idx = arr.findIndex(d => d.sampleID === sample_data[i]['sampleID']);

  }

  // nestSamples(sample_data) {
  //   let arr = [];
  //
  //   for (let i = 0; i < sample_data.length; i++) {
  //     let arr_idx = arr.findIndex(d => d.sampleID === sample_data[i]['sampleID']);
  //     if (arr_idx < 0) {
  //       // Sample id isn't in the array; add it now.
  //       arr.push({
  //         'sampleID': sample_data[i]['sampleID'],
  //         'dilutionFactor': sample_data[i]['dilutionFactor'],
  //         'freezingBuffer': sample_data[i]['freezingBuffer'],
  //         'isolationDate': sample_data[i]['isolationDate'],
  //         'species': sample_data[i]['species'],
  //         'protocol': sample_data[i]['protocol'],
  //         'sourceSampleID': sample_data[i]['sourceSampleID'],
  //         'sampleType': sample_data[i]['sampleType'],
  //         'location': [{ 'lab': sample_data[i]['location'], 'numAliquots': sample_data[i]['numAliquots'] }]
  //       });
  //     } else {
  //       arr[arr_idx]['location'].push({ 'lab': sample_data[i]['location'], 'numAliquots': sample_data[i]['numAliquots'] });
  //     }
  //   }
  //   return (arr)
  // }
  //
}
