import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map, catchError } from "rxjs/operators";
import { Observable, Subject, BehaviorSubject } from 'rxjs';

import * as d3 from 'd3';

import { environment } from "../../environments/environment";
import { Sample, SampleWide } from '../_models/';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class GetSamplesService {
  samples: Sample[] =
    [
      {
        "id": "testpatient-4",
        "patient_id": "testpatient",
        "visit_code": 4,
        "patient_cohort": "Ebola",
        "patient_type": "survivor",
        "isolation_date": "2018-06-27",
        "sample_type": "PBMC",
        "num_aliquots": 1,
        "sample_source": "blood_purple-EDTA",
        "protocol_version": "viable_PBMC_protocol_v1.0.0.docx",
        "freezing_buffer": "",
        "dilution_factor": "NA",
        "sample_id": "testpatient-4_PBMC20180627",
        "location": "Tulane-Schieffelin",
        "species": "human",
        "updated": "2018-10-01",
        "updated_by": "Laura Hughes"
      }
    ];

  test_doc: Object = {
    "id": "testpatient-2",
    "patient_id": "testpatient",
    "visit_code": 2,
    "patient_cohort": "Ebola",
    "patient_type": "survivor",
    "isolation_date": "2018-06-27",
    "sample_type": "DNA",
    "num_aliquots": 1,
    "sample_source": "PBMC",
    "protocol_version": "genomicDNA_protocol_v1.1.0.docx",
    "freezing_buffer": "",
    "dilution_factor": "NA",
    "sample_id": "testpatient-2_DNA20180627",
    // "sample_id": "test_2",
    "location": "KGH",
    // "location": "TSRI-Andersen",
    "species": "human",
    "updated": "2018-10-01",
    "updated_by": "Laura Hughes"
  }


  private samples_wide: SampleWide[] = [];
  public samplesSubject: BehaviorSubject<Object[]> = new BehaviorSubject<Object[]>([]);
  public samplesWideSubject: BehaviorSubject<Object[]> = new BehaviorSubject<Object[]>([]);
  public samplesState$ = this.samplesSubject.asObservable();
  public samplesWideState$ = this.samplesWideSubject.asObservable();


  constructor(public http: HttpClient, private authSvc: AuthService) {
    // console.log(this.samples.slice(20, 25));
    // this.putSamples(this.samples);
    // this.putSample(this.samples[1]);
    // this.getSamples();
    // this.getSample('test_1');
    //
    this.authSvc.loginState$.subscribe((authenticated: boolean) => {
      if (authenticated) {
        this.getSamples();
      }
    })
  }

  getSample(id: string) {
    this.http.get<any[]>(environment.api_url + "/api/sample/" + id, {
      // this.http.get<any[]>(environment.host_url + "/api/sample/test_2", {
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

    this.http.get<any[]>(environment.api_url + "/api/sample/query?q=__all__&size=1000", {
      // this.http.get<any[]>(environment.host_url + "/api/sample/test_2", {
      observe: 'response',
      headers: new HttpHeaders()
        .set('Accept', 'application/json')
    }).subscribe(data => {
      let samples = data['body']['hits'];
      console.log(data)
      this.samplesSubject.next(samples);
      // this.samplesSubject.next(this.samples.slice(0, 11));
      if (samples) {
        // Splay out wide
        this.samples_wide = d3.nest()
          .key((d: any) => d.id)
          .rollup(function(v: any): any {
            return {
              count: v.length,
              patient_id: v[0].patient_id,
              visit_code: v[0].visit_code,
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
        this.authSvc.setAuthorized();


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
        this.authSvc.redirectUnauthorized(err);
      })
    // return (this.samples)
  }

  putSample(sample: Sample) {
    let sample_id = sample['sample_id'];
    this.http.put<any[]>(environment.api_url + "/api/sample/" + sample_id,
      JSON.stringify(sample),
      {
        headers: new HttpHeaders()
      }).subscribe(resp => {
        console.log(resp)
      },
        err => {
          console.log(err)
        })

  }

  prepSamples(samples: Sample[]) {
    // (1) find if sample already exists within the backend -- add or update?
    // (2) add in dateModified
  }

  putSamples(samples: Sample[]) {
    // let test = this.jsonify(this.samples.slice(0,2));
    console.log('attempting to add new record')
    // console.log(this.jsonify(samples))
    this.http.put<any[]>(environment.api_url + "/api/sample/",
      this.jsonify(samples),
      {
        // observe: 'response',
        headers: new HttpHeaders()
        // .set('data', )
      }).subscribe(resp => {
        console.log(resp)
      },
        err => {
          console.log(err)
        })

  }

  // Function to convert
  jsonify(arr: any[]): string {
    let json_arr = [];

    for (let record of arr) {
      json_arr.push(JSON.stringify(record))
    }
    return (json_arr.join("\n"))
  }


  nestSamples() {

    for (let i = 0; i < this.samples_wide.length; i++) {
      let row = this.samples_wide[i];
      let row_vals = row['value'].all_data;
      let arr = [];

      for (let j = 0; j < row_vals.length; j++) {
        let stype = row_vals[j].sample_type;
        // console.log(stype)
        // let stype_idx = row.findIndex(d => stype === );
        if (row.hasOwnProperty(stype)) {
          this.samples_wide[i][stype]['location'].push({ 'lab': row_vals[j]['location'], 'num_aliquots': row_vals[j]['num_aliquots'], 'updated': row_vals[j]['updated'], 'updated_by': row_vals[j]['updated_by'] });
        } else {
          let indiv_sample = {
            'sample_id': row_vals[j]['sample_id'],
            'dilution_factor': row_vals[j]['dilution_factor'],
            'freezing_buffer': row_vals[j]['freezing_buffer'],
            'isolation_date': row_vals[j]['isolation_date'],
            'species': row_vals[j]['species'],
            'protocol': row_vals[j]['protocol'],
            'sample_source': row_vals[j]['sample_source'],
            'sample_type': row_vals[j]['sample_type'],
            'location': [{ 'lab': row_vals[j]['location'], 'num_aliquots': row_vals[j]['num_aliquots'], 'updated': row_vals[j]['updated'], 'updated_by': row_vals[j]['updated_by'] }]
          };

          this.samples_wide[i][stype] = indiv_sample;
        }
      }
    }
    // console.log(this.samples_wide)
    // let arr_idx = arr.findIndex(d => d.sample_id === sample_data[i]['sample_id']);

  }

  // nestSamples(sample_data) {
  //   let arr = [];
  //
  //   for (let i = 0; i < sample_data.length; i++) {
  //     let arr_idx = arr.findIndex(d => d.sample_id === sample_data[i]['sample_id']);
  //     if (arr_idx < 0) {
  //       // Sample id isn't in the array; add it now.
  //       arr.push({
  //         'sample_id': sample_data[i]['sample_id'],
  //         'dilution_factor': sample_data[i]['dilution_factor'],
  //         'freezing_buffer': sample_data[i]['freezing_buffer'],
  //         'isolation_date': sample_data[i]['isolation_date'],
  //         'species': sample_data[i]['species'],
  //         'protocol': sample_data[i]['protocol'],
  //         'sample_source': sample_data[i]['sample_source'],
  //         'sample_type': sample_data[i]['sample_type'],
  //         'location': [{ 'lab': sample_data[i]['location'], 'num_aliquots': sample_data[i]['num_aliquots'] }]
  //       });
  //     } else {
  //       arr[arr_idx]['location'].push({ 'lab': sample_data[i]['location'], 'num_aliquots': sample_data[i]['num_aliquots'] });
  //     }
  //   }
  //   return (arr)
  // }
  //
}
