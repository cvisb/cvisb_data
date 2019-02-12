import { Component, OnInit } from '@angular/core';

import { GetPatientsService } from '../../_services/';
import { Patient, PatientArray } from '../../_models';

@Component({
  selector: 'app-filter-patients',
  templateUrl: './filter-patients.component.html',
  styleUrls: ['./filter-patients.component.scss']
})
export class FilterPatientsComponent implements OnInit {
  public patients: Patient[];
  public patientSummary: PatientArray;


  constructor(private patientSvc: GetPatientsService,) {
    // grab the data`
    // this.patients = patientSvc.getPatients();
    this.patientSvc.patientsState$.subscribe((pList: Patient[]) => {
      console.log(pList)

      if(pList && pList.length > 1) {
        this.patients = pList;

      this.patientSummary = new PatientArray(this.patients);
        console.log(this.patientSummary);
    }

    })


  }

  ngOnInit() {
  }

}
