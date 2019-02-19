import { Component, OnInit } from '@angular/core';

import { GetPatientsService, RequestParametersService, AuthService } from '../../_services/';
import { Patient, PatientArray, AuthState } from '../../_models';

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


  constructor(private patientSvc: GetPatientsService,
    private requestSvc: RequestParametersService,
    private authSvc: AuthService
  ) {
    // grab the data
    this.patientSvc.patientsState$.subscribe((pList: PatientArray) => {
      if (pList) {
        this.patients = pList.patients;
        this.patientSummary = pList;

// On the initial return object, set the maximum parameters
        if(this.first_call) {
          console.log("FIRST CALL!")
          this.first_call = false;
          this.total_patients = this.patients.length;
          this.total_cohorts = ["Lassa", "Ebola", "Control", "Unknown"];
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

}
