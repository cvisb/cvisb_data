import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map, catchError } from "rxjs/operators";
import { Observable, Subject, BehaviorSubject } from 'rxjs';

import * as d3 from 'd3';

import { environment } from "../../environments/environment";
import { Sample, SampleWide, AuthState, RequestParamArray } from '../_models/';
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


  constructor(
    public myhttp: MyHttpClient,
    // public http: HttpClient,
    private requestSvc: RequestParametersService,
    private authSvc: AuthService) {
    // console.log(this.samples.slice(20, 25));
    // this.putSamples(this.samples);
    // this.putSample(this.samples[1]);
    // this.getSamples();
    // this.getSample('test_1');
    //
    this.authSvc.authState$.subscribe((authState: AuthState) => {
      if (authState.authorized) {
        this.getSamples();
      }
    })

    this.requestSvc.sampleParamsState$.subscribe((params: RequestParamArray) => {
      // console.log(params)
      this.request_params = params;
      this.getSamples();
    })

  }

  getSample(id: string) {
    this.myhttp.get<any[]>(environment.api_url + "/api/sample/" + id, {
      // this.myhttp.get<any[]>(environment.host_url + "/api/sample/test_2", {
      observe: 'response',
      headers: new HttpHeaders()
        .set('Accept', 'application/json')
    }).subscribe(data => {
      console.log(data)
      return (data.body)
    },
      err => {
        console.log(err)
      })
  }

  getSamples() {
    let param_string = this.requestSvc.reduceParams(this.request_params);
    // console.log(param_string);
    //
    param_string = param_string.set('size', "1000")

    this.myhttp.get<any[]>(`${environment.api_url}/api/sample/query`, {
      // this.myhttp.get<any[]>(environment.host_url + "/api/sample/test_2", {
      observe: 'response',
      headers: new HttpHeaders()
        .set('Accept', 'application/json'),
      params: param_string
    }).subscribe(data => {
      let samples = data['body']['hits'];
      console.log(data)
      this.samplesSubject.next(samples);
      // this.samplesSubject.next(this.samples.slice(0, 11));
      if (samples) {
        // console.log(this.samples_wide)

        // for(let i =0; i < this.samples.length)

        // this.nestSamples(this.samples_wide[0].value.samples)
        // this.samples_wide.forEach((obj: any) => {
        //   obj['PBMC'] = this.nestSamples(obj.value.all_data);
        // });

        // Set status to be authorized
        // this.authSvc.setAuthorized();


        // Grab the sample locations and data and reshape to display in the table.
        this.nestSamples(samples);
        this.samplesWideSubject.next(this.samples_wide);
      } else {
        console.log('Error in getting samples')
        console.log(data)
      }
      // console.log(this.samples_wide)
    },
      err => {
        console.log(err);
        // check if unauthorized; if so, redirect.
        // this.authSvc.redirectUnauthorized(err);
      })
    // return (this.samples)
  }

  // putSample(sample: Sample) {
  //   let sampleID = sample['sampleID'];
  //   this.myhttp.put<any[]>(environment.api_url + "/api/sample/" + sampleID,
  //     JSON.stringify(sample),
  //     {
  //       headers: new HttpHeaders()
  //     }).subscribe(resp => {
  //       console.log(resp)
  //     },
  //       err => {
  //         console.log(err)
  //       })
  //
  // }
  //
  //
  // putSamples(samples: Sample[]) {
  //   // let test = this.jsonify(this.samples.slice(0,2));
  //   console.log('attempting to add new record')
  //   // console.log(this.jsonify(samples))
  //   this.myhttp.put<any[]>(environment.api_url + "/api/sample/",
  //     this.jsonify(samples),
  //     {
  //       // observe: 'response',
  //       headers: new HttpHeaders()
  //       // .set('data', )
  //     }).subscribe(resp => {
  //       console.log(resp)
  //     },
  //       err => {
  //         console.log(err)
  //       })
  //
  // }
  //
  // // Function to convert
  // jsonify(arr: any[]): string {
  //   let json_arr = [];
  //
  //   for (let record of arr) {
  //     json_arr.push(JSON.stringify(record))
  //   }
  //   return (json_arr.join("\n"))
  // }


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
          prev["patientID"] = updateSet(prev, curr, "patientID");
          prev["privatePatientID"] = updateSet(prev, curr, "privatePatientID");
          prev["visitCode"] = updateSet(prev, curr, "visitCode");

          prev[curr["sampleType"]] ? prev[curr["sampleType"]].push(curr) : prev[curr["sampleType"]] = [curr];
          return prev;
        }, {});
      })
      .entries(samples)
      .map((d) => d.value);

    // console.log(this.samples_wide)

    // For each sample type, nest the locations together. Key = sample ID; values = array of locations + metadata.
    let sample_types = Array.from(new Set(samples.map(d => d.sampleType)));
    this.samples_wide.forEach(patientGroup => {

      sample_types.forEach((type: any) => {
        if (patientGroup[type]) {
          patientGroup[type] = d3.nest()
            .key((d: any) => d.sampleID)
            .entries(patientGroup[type])
        }
      })
    })

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
