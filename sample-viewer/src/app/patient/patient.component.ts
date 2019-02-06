import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { AuthService, GetPatientsService } from '../_services';
import { Patient, PatientArray } from '../_models';

@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.scss']
})
export class PatientComponent implements OnInit {
  private patients: any;

  constructor(
    // private router: Router,
    private route: ActivatedRoute,
    private authSvc: AuthService,
    private patientSvc: GetPatientsService,
    private titleSvc: Title) {
    route.data.subscribe(params => {
      // change the title of the page
      titleSvc.setTitle(params.title);
    });

    // call authentication service to check if logged in
    // authSvc.checkLogin();

    this.patientSvc.patientsState$.subscribe((pList: Patient[]) => {
      this.patients = new PatientArray(pList);
    })

  }

  ngOnInit() {
  }

}
