import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { ActivatedRoute } from '@angular/router';

import { GetPatientsService, ApiService } from '../_services/';
import { Patient, ViralSeqObj } from '../_models';

@Component({
  selector: 'app-patient-page',
  templateUrl: './patient-page.component.html',
  styleUrls: ['./patient-page.component.scss']
})
export class PatientPageComponent implements OnInit {
  patientID: string;
  patient: Patient;
  fragment: string;
  viralSeq: ViralSeqObj[];
  HLA: any[];
  publications: any[];


  constructor(
    private titleSvc: Title,
    private route: ActivatedRoute,
    private patientSvc: GetPatientsService,
    private apiSvc: ApiService
  ) {
    this.route.params.subscribe(params => {
      this.patientID = params.pid;

      titleSvc.setTitle(this.route.snapshot.data.titleStart + this.patientID + this.route.snapshot.data.titleEnd);

      this.patientSvc.getPatient(this.patientID).subscribe((patient) => {
        this.patient = patient;
      });

      this.apiSvc.getPatient('experiment', this.patientID).subscribe(expts => {
        console.log(expts);
        this.viralSeq = expts['hits'].filter(d => d.measurementTechnique === 'viral sequencing');

        this.HLA = expts['hits'].filter(d => d.measurementTechnique === 'viral sequencing');

        this.publications = expts['hits'].map(d => d.publication).filter(d => d).flat();
      })
    })

    // For anchor jumping
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
