import { Component, OnInit } from '@angular/core';

import { GetPatientsService, RequestParametersService } from '../../_services/';
import { Patient, PatientArray } from '../../_models';

@Component({
  selector: 'app-filter-patients',
  templateUrl: './filter-patients.component.html',
  styleUrls: ['./filter-patients.component.scss']
})
export class FilterPatientsComponent implements OnInit {
  public patients: Patient[];
  public patientSummary: PatientArray;
  total_patients: number;


  constructor(private patientSvc: GetPatientsService,
    private requestSvc: RequestParametersService) {
    // grab the data
    this.patientSvc.patientsState$.subscribe((pList: PatientArray) => {
      this.patients = pList.patients;

      this.patientSummary = pList;
    })

  }

  ngOnInit() {
  }

  clearFilters() {
    this.requestSvc.patientParamsSubject.next([]);
  }

}
