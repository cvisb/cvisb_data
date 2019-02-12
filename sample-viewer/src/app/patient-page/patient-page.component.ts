import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { ActivatedRoute } from '@angular/router';

import { GetPatientsService } from '../_services/';
import { Patient } from '../_models';

@Component({
  selector: 'app-patient-page',
  templateUrl: './patient-page.component.html',
  styleUrls: ['./patient-page.component.scss']
})
export class PatientPageComponent implements OnInit {
  patientID: string;
  patient: Patient;
  fragment: string;

  constructor(
    private titleSvc: Title,
    private route: ActivatedRoute,
    private patientSvc: GetPatientsService
  ) {
    this.route.params.subscribe(params => {
      this.patientID = params.pid;

      titleSvc.setTitle(this.route.snapshot.data.titleStart + this.patientID + this.route.snapshot.data.titleEnd);

      this.patientSvc.getPatient(this.patientID).subscribe((patient) => {
        this.patient = patient;
      });


      // this.patientSvc.patientsState$.subscribe((pList: Patient[]) => {
      //   this.patient = pList.filter((d: any) => d.patientID === this.patientID)[0];
      // })
      console.log(this.patient)
    })

    this.route.fragment.subscribe(fragment => {
      this.fragment = fragment;
    })
  }

  ngOnInit() {
    let anchor_div = document.querySelector("#" + this.fragment);
    if (anchor_div) {
      anchor_div.scrollIntoView();
    }
  }

}
