import { Injectable } from '@angular/core';

import { HttpHeaders, HttpParams } from '@angular/common/http';
import { map, catchError } from "rxjs/operators";
import { Observable, Subject, BehaviorSubject, throwError } from 'rxjs';
import { Router } from '@angular/router';

import { environment } from "../../environments/environment";

import { Patient, AuthState, RequestParamArray, RequestParam } from '../_models';
import { AuthService } from './auth.service';
import { ApiService } from './api.service';
import { MyHttpClient } from './http-cookies.service';

import PATIENTS from '../../assets/data/patients.json';


@Injectable({
  providedIn: 'root'
})

export class GetPatientsService {
  patients: Patient[];
  request_params: RequestParamArray;

  // Event listener for parameters to run on
  public patientParamsSubject: BehaviorSubject<RequestParamArray> = new BehaviorSubject<RequestParamArray>([]);
  public patientParamsState$ = this.patientParamsSubject.asObservable();

  // Event listener for the patient array.
  public patientsSubject: BehaviorSubject<Patient[]> = new BehaviorSubject<Patient[]>([]);
  public patientsState$ = this.patientsSubject.asObservable();


  fakePatients: Patient[] = [
    {
      patientID: "G-fakePatient-0001",
      cohort: "Lassa",
      outcome: "survivor",
      infectionDate: "2018-06-01",
      admitDate: "2018-06-01",
      alternateIdentifier: ["fake1", 'faker2'],
      country: {
        name: "Sierra Leone",
        identifier: "SL"
      },
      homeLocation: [
        { name: "Kenema", administrativeType: "district", administrativeUnit: 2 },
        { name: "Eastern", administrativeType: "province", administrativeUnit: 1 },
      ],
      gender: "Female",
      age: 17,
      relatedTo: ["C-fakePatient-0001-1", "C-fakePatient-0001-2"],
      // availableData: [
      //   {
      //     name: "ELISA",
      //     identifier: "elisa",
      //     url: "blah"
      //   },
      //   {
      //     name: "Rapid Diagnostics",
      //     identifier: "rdt",
      //     url: "blah"
      //   },
      //   {
      //     name: "RT-PCR",
      //     identifier: "rt_pcr",
      //     url: "blah"
      //   },
      //   {
      //     name: "HLA",
      //     identifier: "hla",
      //     distribution: "blah",
      //     data: ["A*290201", "A*340201", "B*2703", "B*780101", "C*020202", "C*160101", "DPA1*020107", "DPA1*020202", "DPB1*010101", "DPB1*130101", "DQA1*010501", "DQA1*030301", "DQB1*020201", "DQB1*050101", "DRB1*100101", "DRB1*090102", "-", "-", "DRB4*010101", "DRB4*01@13", "-", "-"]
      //   },
      //   {
      //     name: "Viral Sequencing",
      //     identifier: "viralseq",
      //     url: "blah"
      //   },
      //   {
      //     name: "Systems Serology",
      //     identifier: "systemsserology",
      //     url: "blah",
      //     data: [
      //       { assay: "ADNP", value: 126.1511933 },
      //       { assay: "ADCP 1:150", value: 70.77008 },
      //       { assay: "ADCP 1:750", value: 33.15582 },
      //       { assay: "ADCP 1:3750", value: 21.41597 },
      //       { assay: "ADCP_AUC", value: 113049 },
      //       { assay: "ADCD", value: 2442 },
      //       { assay: "NKD: CD107a A", value: 13.5 },
      //       { assay: "NKD: CD107a B", value: 16.1 },
      //       { assay: "NKD: CD107a C", value: 8.75 },
      //       { assay: "NKD: IFNg A", value: 6.24 },
      //       { assay: "NKD: IFNg B", value: 5.46 },
      //       { assay: "NKD: IFNg C", value: 2.23 },
      //       { assay: "NKD: MIP-1b A", value: 24.9 },
      //       { assay: "NKD: MIP-1b B", value: 21.8 },
      //       { assay: "NKD: MIP-1b C", value: 17.8 }
      //     ]
      //   },
      //   {
      //     name: "BCR",
      //     identifier: "bcr",
      //     url: "blah"
      //   },
      //   {
      //     name: "TCR",
      //     identifier: "tcr",
      //     url: "blah"
      //   },
      // ],

      elisa: [
        {
          virus: "Lassa",
          assayType: "IgG",
          ELISAresult: "positive"
        }
      ]
    },
    {
      patientID: "C-fakePatient-0001-1",
      cohort: "Lassa",
      outcome: "contact",
      infectionDate: "2018-06-01",
      country: {
        name: "Sierra Leone",
        identifier: "SL"
      },
      homeLocation: [
        { name: "Kenema", administrativeType: "district", administrativeUnit: 2 },
        { name: "Eastern", administrativeType: "province", administrativeUnit: 1 },
      ],
      gender: "Male",
      age: 41,
      relatedTo: ["G-fakePatient-0001", "C-fakePatient-0001-2"],
      associatedSamples: ['0', '1'],
      // availableData: [
      //   {
      //     name: "ELISA",
      //     identifier: "elisa",
      //     url: "blah"
      //   },
      //   {
      //     name: "HLA",
      //     identifier: "hla",
      //     url: "blah",
      //     data: ["A*290201", "A*340201", "B*2703", "B*780101", "C*020202", "C*160101", "DPA1*020107", "DPA1*020202", "DPB1*010101", "DPB1*130101", "DQA1*010501", "DQA1*030301", "DQB1*020201", "DQB1*050101", "DRB1*100101", "DRB1*090102", "-", "-", "DRB4*010101", "DRB4*01@13", "-", "-"]
      //   },
      // ],
      elisa: [
        {
          virus: "Lassa",
          assayType: "IgG",
          ELISAresult: "negative"
        }
      ]
    },
    {
      patientID: "C-fakePatient-0001-2",
      cohort: "Lassa",
      outcome: "contact",
      country: {
        name: "Nigeria",
        identifier: "NG"
      },
      homeLocation: [
        { name: "Kenema", administrativeType: "district", administrativeUnit: 2 },
        { name: "Eastern", administrativeType: "province", administrativeUnit: 1 },
      ],
      gender: "Female",
      age: 38,
      relatedTo: ["G-fakePatient-0001", "C-fakePatient-0001-1"],
      associatedSamples: ['0', '1'],
      // availableData: [
      //   {
      //     name: "ELISA",
      //     identifier: "elisa",
      //     url: "blah"
      //   },
      // ],
      elisa: [
        {
          virus: "Lassa",
          assayType: "IgG",
          ELISAresult: "negative"
        }
      ]
    },

  ];

  constructor(
    public myhttp: MyHttpClient,
    private router: Router,
    private apiSvc: ApiService,
    private authSvc: AuthService) {
    // this.request_params = [new RequestParam("id", ["test", "test2"])];
    // console.log(this.request_params)
    console.log(PATIENTS)
    this.patients = PATIENTS.concat(this.fakePatients);

    // this.getPatients();
    //
    // this.apiSvc.wipeEndpoint('patient');

    // this.apiSvc.put('patient', this.fakePatients);

    this.authSvc.authState$.subscribe((authState: AuthState) => {
      if (authState.authorized) {
        this.getPatients();
      }
    })

    this.patientParamsState$.subscribe((params: RequestParamArray) => {
      console.log('New params!!!!')
      this.request_params = params;
      this.getPatients();
    })

    this.patients.sort((a: any, b: any) => (a.availableData && b.availableData) ? (b.availableData.length - a.availableData.length) : (a.patientID < b.patientID ? -1 : 1));
    // this.patients.sort((a: any, b: any) => this.sortFunc(a, b));
  }

  sortFunc(a: any, b: any) {
    // Sort by available data length first
    if (a.availableData && b.availableData) {
      return ((b.availableData.length - a.availableData.length) || (a.patientID < b.patientID ? -1 : 1));

    } else {
      return ((a.patientID < b.patientID ? -1 : 1));
    }
  }

  getPatient(id: string): any {
    // temp hard-coded shim.
    // return (this.patients.filter((d: any) => d.patientID === id)[0]);
    return this.apiSvc.getOne('patient', id, 'patientID')
  }

  getPatients() {

    let param_string: string;
    if (this.request_params && this.request_params.length > 0) {
      if (Array.isArray(this.request_params[0].value)) {
        param_string = (`${this.request_params[0].field}:\(\"${this.request_params[0].value.join('" "')}\"\)`)
      } else {
        param_string = (`${this.request_params[0].field}:\"${this.request_params[0].value}\"`);
      }
    } else {
      param_string = "__all__"
    }

    console.log(param_string)

    return this.myhttp.get<any[]>(`${environment.api_url}/api/patient/query`, {
      observe: 'response',
      headers: new HttpHeaders()
        .set('Accept', 'application/json'),
      params: new HttpParams()
        .set('q', param_string)
        .set('size', "1000")
    }).subscribe(data => {
      let patients = data['body']['hits'];
      console.log(data)

      // Sort patients by available data length, then alpha.
      patients.sort((a: any, b: any) => (a.availableData && b.availableData) ? (b.availableData.length - a.availableData.length) : (a.patientID < b.patientID ? -1 : 1));

      // send new patients to subscription services.
      this.patientsSubject.next(patients);

    },
      err => {
        console.log('Error in getting patients')
        console.log(err)

        // check if unauthorized; if so, redirect.
        // this.authSvc.redirectUnauthorized(err);
      })
  }

  getAllPatients() {
    console.log('calling backend to get patients');
    console.log(this.patients);



    this.myhttp.get<any[]>(environment.api_url + "/api/patient/query?q=__all__&size=1000", {
      // this.myhttp.get<any[]>(environment.host_url + "/api/sample/test_2", {
      observe: 'response',
      headers: new HttpHeaders()
        .set('Accept', 'application/json')
    }).subscribe(data => {
      let patients = data['body']['hits'];
      console.log(data)

      // Sort patients by available data length, then alpha.
      patients.sort((a: any, b: any) => (a.availableData && b.availableData) ? (b.availableData.length - a.availableData.length) : (a.patientID < b.patientID ? -1 : 1));

      // send new patients to subscription services.
      this.patientsSubject.next(patients);

    },
      err => {
        console.log('Error in getting patients')
        console.log(err)

        // check if unauthorized; if so, redirect.
        // this.authSvc.redirectUnauthorized(err);
      })
  }


  putPatients(patients: Patient[]) {
    console.log('attempting to add new record')
    this.myhttp.put<any[]>(environment.api_url + "/api/patient",
      this.jsonify(patients),
      {
        headers: new HttpHeaders()
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

  // putPatient(patient: Patient) {
  //   let sample_id = sample['sample_id'];
  //   this.myhttp.put<any[]>(environment.api_url + "/api/patient/" + sample_id,
  //     JSON.stringify(sample),
  //     {
  //       headers: new HttpHeaders()
  //     }).subscribe(resp => {
  //       console.log(resp)
  //     },
  //       err => {
  //         console.log(err)
  //       })
  // }

}
