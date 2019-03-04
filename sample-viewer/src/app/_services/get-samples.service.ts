import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map, catchError } from "rxjs/operators";
import { Observable, Subject, BehaviorSubject } from 'rxjs';

import * as d3 from 'd3';

import { environment } from "../../environments/environment";
import { Sample, SampleWide, AuthState } from '../_models/';
import { AuthService } from './auth.service';
import { MyHttpClient } from './http-cookies.service';

@Injectable({
  providedIn: 'root'
})

export class GetSamplesService {
  // samples: Sample[] =
  //   [
  //     {
  //       "id": "testpatient-4",
  //       "patient_id": "testpatient",
  //       "visitCode": 4,
  //       "patient_cohort": "Ebola",
  //       "patient_type": "survivor",
  //       "isolationDate": "2018-06-27",
  //       "sampleType": "PBMC",
  //       "numAliquots": 1,
  //       "sourceSampleID": "blood_purple-EDTA",
  //       "protocol_version": "viable_PBMC_protocol_v1.0.0.docx",
  //       "freezingBuffer": "",
  //       "dilutionFactor": "NA",
  //       "sampleID": "testpatient-4_PBMC20180627",
  //       "location": "Tulane-Schieffelin",
  //       "species": "human",
  //       "updated": "2018-10-01",
  //       "updatedBy": "Laura Hughes"
  //     }
  //   ];
  //
  // test_doc: Object = {
  //   "id": "testpatient-2",
  //   "patient_id": "testpatient",
  //   "visitCode": 2,
  //   "patient_cohort": "Ebola",
  //   "patient_type": "survivor",
  //   "isolationDate": "2018-06-27",
  //   "sampleType": "DNA",
  //   "numAliquots": 1,
  //   "sourceSampleID": "PBMC",
  //   "protocol_version": "genomicDNA_protocol_v1.1.0.docx",
  //   "freezingBuffer": "",
  //   "dilutionFactor": "NA",
  //   "sampleID": "testpatient-2_DNA20180627",
  //   // "sampleID": "test_2",
  //   "location": "KGH",
  //   // "location": "TSRI-Andersen",
  //   "species": "human",
  //   "updated": "2018-10-01",
  //   "updatedBy": "Laura Hughes"
  // }


  private samples_wide: SampleWide[] = [];
  public samplesSubject: BehaviorSubject<Object[]> = new BehaviorSubject<Object[]>([]);
  public samplesWideSubject: BehaviorSubject<Object[]> = new BehaviorSubject<Object[]>([]);
  public samplesState$ = this.samplesSubject.asObservable();
  public samplesWideState$ = this.samplesWideSubject.asObservable();


  constructor(
    public myhttp: MyHttpClient,
    // public http: HttpClient,
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
    console.log('calling backend to get samples');

    this.myhttp.get<any[]>(environment.api_url + "/api/sample/query?q=__all__&size=1000", {
      // this.myhttp.get<any[]>(environment.host_url + "/api/sample/test_2", {
      observe: 'response',
      headers: new HttpHeaders()
        .set('Accept', 'application/json')
    }).subscribe(data => {
      let samples = data['body']['hits'];
      console.log(data)
      this.samplesSubject.next(samples);
      // this.samplesSubject.next(this.samples.slice(0, 11));
      if (samples) {
        // Splay out wide by patient ID.
        this.samples_wide = d3.nest()
          .key((d: any) => d.patientID)
          .key((d: any) => d.visitCode)
          .rollup(function(v: any): any {
            return {
              count: v.length,
              patientID: v[0].patientID,
              visitCode: v[0].visitCode,
              patient_type: v[0].patient_type,
              patient_cohort: v[0].patient_cohort,
              all_data: v.map(d => d)
            };
          })
          .entries(samples);

        // for(let i =0; i < this.samples.length)

        // this.nestSamples(this.samples_wide[0].value.samples)
        // this.samples_wide.forEach((obj: any) => {
        //   obj['PBMC'] = this.nestSamples(obj.value.all_data);
        // });

        // Set status to be authorized
        // this.authSvc.setAuthorized();


        // Grab the sample locations and data and reshape to display in the table.
        this.nestSamples();
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


  nestSamples() {

    for (let i = 0; i < this.samples_wide.length; i++) {
      let row = this.samples_wide[i];
      let row_vals = row['value'].all_data;
      let arr = [];

      for (let j = 0; j < row_vals.length; j++) {
        let stype = row_vals[j].sampleType;
        // console.log(stype)
        // let stype_idx = row.findIndex(d => stype === );
        if (row.hasOwnProperty(stype)) {
          this.samples_wide[i][stype]['location'].push({ 'lab': row_vals[j]['location'], 'numAliquots': row_vals[j]['numAliquots'], 'updated': row_vals[j]['updated'], 'updatedBy': row_vals[j]['updatedBy'] });
        } else {
          let indiv_sample = {
            'sampleID': row_vals[j]['sampleID'],
            'dilutionFactor': row_vals[j]['dilutionFactor'],
            'freezingBuffer': row_vals[j]['freezingBuffer'],
            'isolationDate': row_vals[j]['isolationDate'],
            'species': row_vals[j]['species'],
            'protocol': row_vals[j]['protocol'],
            'sourceSampleID': row_vals[j]['sourceSampleID'],
            'sampleType': row_vals[j]['sampleType'],
            'location': [{ 'lab': row_vals[j]['location'], 'numAliquots': row_vals[j]['numAliquots'], 'updated': row_vals[j]['updated'], 'updatedBy': row_vals[j]['updatedBy'] }]
          };

          this.samples_wide[i][stype] = indiv_sample;
        }
      }
    }
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
