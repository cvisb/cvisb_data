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
  total_patients: number;
  private authenticated: boolean;


  constructor(private patientSvc: GetPatientsService,
    private requestSvc: RequestParametersService,
    private authSvc: AuthService
  ) {
    // grab the data
    this.patientSvc.patientsState$.subscribe((pList: PatientArray) => {
      if (pList) {
        this.patients = pList.patients;
        this.patientSummary = pList;
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
