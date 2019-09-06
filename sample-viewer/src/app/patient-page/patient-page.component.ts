import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { ActivatedRoute } from '@angular/router';

import { GetPatientsService, ApiService, AnchorService } from '../_services/';
import { Patient, ViralSeqObj } from '../_models';
import { ExperimentObjectPipe } from '../_pipes';

@Component({
  selector: 'app-patient-page',
  templateUrl: './patient-page.component.html',
  styleUrls: ['./patient-page.component.scss']
})
export class PatientPageComponent implements OnInit {
  patientID: string;
  patient: Patient;
  viralSeq: ViralSeqObj[];
  viralFiles: Object[];
  HLA: any[];
  HLAFiles: any[];
  publications: any[];
  allExpts: Object[];
  exptTypes: Object[];


  constructor(
    private titleSvc: Title,
    private route: ActivatedRoute,
    private patientSvc: GetPatientsService,
    private apiSvc: ApiService,
    private anchorSvc: AnchorService,
    private exptObjPipe: ExperimentObjectPipe
  ) {
    this.route.params.subscribe(params => {
      this.patientID = params.pid;

      titleSvc.setTitle(this.route.snapshot.data.titleStart + this.patientID + this.route.snapshot.data.titleEnd);

      this.patientSvc.getPatient(this.patientID).subscribe((patient) => {
        this.patient = patient;

        // Double check that altID is an array
        if (!Array.isArray(this.patient.alternateIdentifier)) {
          this.patient.alternateIdentifier = [this.patient.alternateIdentifier];
        }

        // set patient title
        if (this.patient.gID && this.patient.gID.length > 0) {
          this.patient['patientLabel'] = this.patient.gID[0];
        } else if (this.patient.sID) {
          this.patient['patientLabel'] = this.patient.sID;
        } else {
          this.patient['patientLabel'] = this.patient.patientID;
        }
      });

      this.apiSvc.getPatient('experiment', this.patientID).subscribe(expts => {
        this.allExpts = this.exptObjPipe.exptDict;
        console.log(expts);
        let exptData = expts['hits'].map(d => d.measurementTechnique);
        this.exptTypes = this.allExpts.filter(d => exptData.includes(d['name']));

        this.viralSeq = expts['hits'].filter(d => d.measurementTechnique === 'viral sequencing');

        this.HLA = expts['hits'].filter(d => d.measurementTechnique === 'HLA sequencing');

        this.publications = expts['hits'].map(d => d.citation).filter(d => d).flat();
      })

      this.apiSvc.getPatient('datadownload', this.patientID).subscribe(files => {
        console.log(files);
        this.viralFiles = files['hits'].filter(d => d.measurementTechnique === 'viral sequencing');

        this.HLAFiles = files['hits'].filter(d => d.measurementTechnique === 'HLA sequencing');
      })
    })

  }

  ngOnInit() {
    console.log(document)
    // For anchor jumping
    // Needs to be in ngOnInit to make sure page exists before querying document
    this.route.fragment.subscribe(anchor_tag => {
      console.log('on init')
      console.log(document.querySelector("#" + anchor_tag))
      this.anchorSvc.clickAnchor(anchor_tag);
    })
  }

  ngAfterViewInit() {
    // For anchor jumping
    // Needs to be in ngOnInit to make sure page exists before querying document
    this.route.fragment.subscribe(anchor_tag => {
      console.log('after view init')
      console.log(document.querySelector("#" + anchor_tag))
      this.anchorSvc.clickAnchor(anchor_tag);
    })
  }

}
