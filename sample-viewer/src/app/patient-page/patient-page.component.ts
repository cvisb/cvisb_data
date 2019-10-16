import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { ActivatedRoute } from '@angular/router';

import { GetPatientsService, ApiService, AnchorService } from '../_services/';
import { Patient, ViralSeqObj } from '../_models';
import { ExperimentObjectPipe } from '../_pipes';

import { flatMapDeep } from 'lodash';

@Component({
  selector: 'app-patient-page',
  templateUrl: './patient-page.component.html',
  styleUrls: ['./patient-page.component.scss']
})
export class PatientPageComponent {
  patientID: string;
  patient: Patient;
  viralSeq: ViralSeqObj[];
  viralFiles: Object[];
  HLA: any[];
  HLAFiles: any[];
  publications: any[];
  allExpts: Object[];
  exptTypes: Object[];
  demographicsPanelState: boolean = true;
  symptomsPanelState: boolean = true;
  samplesPanelState: boolean = true;
  citationsPanelState: boolean = true;
  elisaPanelState: boolean = true;
  hlaPanelState: boolean = true;
  viralSeqPanelState: boolean = true;

  expansionPanelHeight: string = "42px";
  dataPanelHeight: string = "55px";


  constructor(
    private titleSvc: Title,
    private route: ActivatedRoute,
    private patientSvc: GetPatientsService,
    private apiSvc: ApiService,
    private exptObjPipe: ExperimentObjectPipe
  ) {
    this.route.params.subscribe(params => {
      this.patientID = params.pid;

      this.titleSvc.setTitle(this.route.snapshot.data.titleStart + this.patientID + this.route.snapshot.data.titleEnd);

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
        let exptData = expts['hits'].map(d => d.measurementTechnique);
        this.exptTypes = this.allExpts.filter(d => exptData.includes(d['measurementTechnique']));

        this.viralSeq = expts['hits'].filter(d => d.measurementTechnique === 'viral sequencing');

        this.HLA = expts['hits'].filter(d => d.measurementTechnique === 'HLA sequencing');

        this.publications = flatMapDeep(expts['hits'], d => d.citation).filter(d => d);
      })

      this.apiSvc.getPatient('datadownload', this.patientID).subscribe(files => {
        this.viralFiles = files['hits'].filter(d => d.measurementTechnique === 'viral sequencing');

        this.HLAFiles = files['hits'].filter(d => d.measurementTechnique === 'HLA sequencing');
      })
    })

  }


}
