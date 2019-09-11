import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { AuthService, GetPatientsService } from '../_services';
import { PatientArray } from '../_models';

@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.scss']
})
export class PatientComponent implements OnInit {
  patients: PatientArray;

  constructor(
    // private router: Router,
    private route: ActivatedRoute,
    private authSvc: AuthService,
    private patientSvc: GetPatientsService,
    private titleSvc: Title) {
    console.log("loading patient component");
    route.data.subscribe(params => {
      // change the title of the page
      titleSvc.setTitle(params.title);
    });

    this.patientSvc.patientsState$.subscribe((pList: PatientArray) => {
      // console.log(pList)
      this.patients = pList;
    })

  }

  ngOnInit() {
  }

}
