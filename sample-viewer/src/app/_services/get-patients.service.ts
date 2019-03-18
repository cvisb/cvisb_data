import { Injectable } from '@angular/core';

import { HttpHeaders, HttpParams } from '@angular/common/http';
import { map, catchError } from "rxjs/operators";
import { Observable, Subject, BehaviorSubject, throwError } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';

import { environment } from "../../environments/environment";

import { Patient, PatientArray, AuthState, RequestParamArray, RequestParam } from '../_models';
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

  // Event listener for the patient array.
  public patientsSubject: BehaviorSubject<PatientArray> = new BehaviorSubject<PatientArray>(null);
  public patientsState$ = this.patientsSubject.asObservable();

  // Array of variables to calculate the summary stats for.
  summaryVar: string[] = ["patientID.keyword", "cohort.keyword", "outcome.keyword", "infectionYear", "country.name.keyword"];


  fakePatients: Patient[] = [
    {
      patientID: "G-fakePatient-0003",
      cohort: "Ebola",
      outcome: "dead",
      infectionYear: 2018,
      admitDate: "2018-06-01",
      alternateIdentifier: [],
      country: {
        name: "Sierra Leone",
        identifier: "SL"
      },
      gender: "Male",
      age: 55,
      relatedTo: [],

    },
    {
      patientID: "G-fakePatient-0004",
      cohort: "Ebola",
      outcome: "survivor",
      infectionYear: 2015,
      infectionDate: "2018-06-01",
      admitDate: "2018-06-01",
      alternateIdentifier: [],
      country: {
        name: "Nigeria",
        identifier: "NG"
      },
      gender: "Male",
      age: 93,
      relatedTo: [],

    },
    {
      patientID: "G-fakePatient-0002",
      cohort: "Ebola",
      outcome: "survivor",
      infectionDate: "2018-06-01",
      admitDate: "2018-06-01",
      alternateIdentifier: [],
      country: {
        name: "Sierra Leone",
        identifier: "SL"
      },
      gender: "Male",
      age: 25,
      relatedTo: [],

    },
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
    private route: ActivatedRoute,
    private router: Router,
    private apiSvc: ApiService,
    private requestSvc: RequestParametersService,
    private authSvc: AuthService) {

    // this.apiSvc.put('patient', [this.fakePatients[1]]);

    this.authSvc.authState$.subscribe((authState: AuthState) => {
      if (authState.authorized) {
        this.getPatients();
      }
    })

    this.requestSvc.patientParamsState$.subscribe((params: RequestParamArray) => {
      // console.log(params)
      this.request_params = params;
      this.getPatients();
    })

    let x ={
  "facets": {
    "cohort.keyword": {
      "_type": "terms",
      "other": 0,
      "missing": 0,
      "terms": [
        {
          "term": "Ebola",
          "count": 1235
        }
      ],
      "total": 1235
    },
    "outcome.keyword": {
      "_type": "terms",
      "other": 0,
      "missing": 0,
      "terms": [
        {
          "term": "contact",
          "count": 839
        },
        {
          "term": "survivor",
          "count": 396
        }
      ],
      "total": 1235
    },
    "infectionYear": {
      "_type": "terms",
      "other": 0,
      "missing": 0,
      "terms": [],
      "total": 0
    },
    "patientID.keyword": {
      "_type": "terms",
      "other": 1215,
      "missing": 10,
      "terms": [
        {
          "term": "C-8847721",
          "count": 2
        },
        {
          "term": "C-8908791",
          "count": 2
        },
        {
          "term": "C-8908793",
          "count": 2
        },
        {
          "term": "C-8923111",
          "count": 2
        },
        {
          "term": "C-8923112",
          "count": 2
        },
        {
          "term": "C-8939542",
          "count": 2
        },
        {
          "term": "C-8946691",
          "count": 2
        },
        {
          "term": "C-9001701",
          "count": 2
        },
        {
          "term": "C-9214621",
          "count": 2
        },
        {
          "term": "C-9232671",
          "count": 2
        }
      ],
      "total": 20
    },
    "country.name.keyword": {
      "_type": "terms",
      "other": 0,
      "missing": 0,
      "terms": [
        {
          "term": "Sierra Leone",
          "count": 1235
        }
      ],
      "total": 1235
    }
  },
  "max_score": 0.0,
  "took": 22,
  "total": 1235,
  "hits": []
};
console.log(x)

    // this.patients.sort((a: any, b: any) => (a.availableData && b.availableData) ? (b.availableData.length - a.availableData.length) : (a.patientID < b.patientID ? -1 : 1));
    // this.patients.sort((a: any, b: any) => this.sortFunc(a, b));
  }

  sortFunc(sortVar): string {
    // Sorting func for ES. Since any variable which is a string has to be sorted by keyword, doing a bit of transformation:
    let keywordVars = ["patientID", "outcome", "cohort", "gender"];
    if (keywordVars.includes(sortVar)) {
      return (`${sortVar}.keyword`);
    }

    if (sortVar === "country") {
      return ("country.name.keyword");
    }
    return (sortVar);
  }


  getPatient(id: string): any {
    // temp hard-coded shim.
    // return (this.patients.filter((d: any) => d.patientID === id)[0]);
    return this.apiSvc.getOne('patient', id, 'patientID')
  }

  getPatientSummary(qParams): Observable<any> {

    let param_string: string = this.requestSvc.reduceParams(this.request_params);
    let facet_string = this.summaryVar.join(",");

    let params = new HttpParams()
      .set('q', param_string)
      .set('facets', facet_string)
      .set('facet_size', "5000")
      .set('size', "0");

    return this.myhttp.get<any[]>(`${environment.api_url}/api/patient/query`, {
      observe: 'response',
      headers: new HttpHeaders()
        .set('Accept', 'application/json'),
      params: params
    }).pipe(
      map(res => {
        console.log(res);
        return (res.body)
      }
      )
    );
  }

getAllPatientsSummary(): Observable<any> {
  return(this.getPatientSummary("__all__"));
}


  // based on https://blog.angular-university.io/angular-material-data-table/
  // ex: https://dev.cvisb.org/api/patient/query?q=__all__&size=20&sort=cohort.keyword&sort=age&from=40
  getPatientsPaginated(qParams, pageNum: number = 0,
    pageSize: number = 25, sortVar: string = "", sortDirection?: string): Observable<Patient[]> {

    let param_string: string = this.requestSvc.reduceParams(this.request_params);

    // ES syntax for sorting is `sort=variable:asc` or `sort=variable:desc`
    // BUT-- Biothings changes the syntax to be `sort=+variable` or `sort=-variable`. + is optional for asc sorts
    let sortString: string = sortDirection === "desc" ? `-${this.sortFunc(sortVar)}` : this.sortFunc(sortVar);

    let params = new HttpParams()
      .set('q', param_string)
      .set('size', pageSize.toString())
      .set('from', (pageSize * pageNum).toString())
      .set("sort", sortString);

    return this.myhttp.get<any[]>(`${environment.api_url}/api/patient/query`, {
      observe: 'response',
      headers: new HttpHeaders()
        .set('Accept', 'application/json'),
      params: params
    }).pipe(
      map(res => {
        console.log(res);
        return (res["body"]["hits"])
      }
      )
    );
  }


  getPatients() {
    let param_string: string = this.requestSvc.reduceParams(this.request_params);

    this.router.navigate(
      [],
      {
        relativeTo: this.route,
        queryParams: { q: param_string },
        queryParamsHandling: "merge", // remove to replace all query params by provided
      });

    return this.myhttp.get<any[]>(`${environment.api_url}/api/patient/query`, {
      observe: 'response',
      headers: new HttpHeaders()
        .set('Accept', 'application/json'),
      params: new HttpParams()
        .set('q', param_string)
        .set('size', "1050")
    }).subscribe(data => {
      let patients = data['body']['hits'];
      // console.log(data)

      // Sort patients by available data length, then alpha.
      patients.sort((a: any, b: any) => (a.availableData && b.availableData) ? (b.availableData.length - a.availableData.length) : (a.patientID < b.patientID ? -1 : 1));

      // send new patients to subscription services.
      this.patientsSubject.next(new PatientArray(patients));

    },
      err => {
        console.log('Error in getting patients')
        console.log(err)

        // check if unauthorized; if so, redirect.
        // this.authSvc.redirectUnauthorized(err);
      })
  }



  getAllPatients() {
    console.log('calling backend to get ALL patients');
    // console.log(this.patients);

    this.myhttp.get<any[]>(environment.api_url + "/api/patient/query?q=__all__&size=1050", {
      observe: 'response',
      headers: new HttpHeaders()
        .set('Accept', 'application/json')
    }).subscribe(data => {
      let patients = data['body']['hits'];
      console.log(data)

      // Sort patients by available data length, then alpha.
      patients.sort((a: any, b: any) => (a.availableData && b.availableData) ? (b.availableData.length - a.availableData.length) : (a.patientID < b.patientID ? -1 : 1));

      // send new patients to subscription services.
      this.patientsSubject.next(new PatientArray(patients));

    },
      err => {
        console.log('Error in getting patients')
        console.log(err)
      })
  }
}
