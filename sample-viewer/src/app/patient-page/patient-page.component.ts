import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { ActivatedRoute } from '@angular/router';

import { GetPatientsService, ApiService, AnchorService } from '../_services/';
import { Patient, DataDownload } from '../_models';
import { ExperimentObjectPipe } from '../_pipes/experiment-object.pipe';

import { flatMapDeep } from 'lodash';

@Component({
  selector: 'app-patient-page',
  templateUrl: './patient-page.component.html',
  styleUrls: ['./patient-page.component.scss']
})
export class PatientPageComponent {
  patientID: string;
  patient: Patient;
  publications: any[];
  expts: Object[] = [];
  exptTypes: Object[];
  demographicsPanelState: boolean = true;
  symptomsPanelState: boolean = true;
  samplesPanelState: boolean = true;
  citationsPanelState: boolean = true;
  elisaPanelState: boolean = true;
  hlaPanelState: boolean = true;
  viralSeqPanelState: boolean = true;
  // today = new Date();
  today = new Date("2019-10-16");

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

      this.apiSvc.getData4Patient('experiment', this.patientID).subscribe(expts => {
        this.expts = expts['hits'];

        this.expts.forEach(expt => {
          expt['embargoed'] = new Date(expt['releaseDate']) <= this.today;
        })

        let allExpts = this.exptObjPipe.exptDict;
        let dsIDs = this.expts.map(d => d['includedInDataset']);
        this.exptTypes = allExpts.filter(d => dsIDs.includes(d['dataset_id']));
        // this.exptTypes = this.expts.map(d => d['includedInDataset']);
        console.log(this.expts)
        // console.log(this.exptTypes)

        this.publications = flatMapDeep(expts['hits'], d => d.citation).filter(d => d);
      })
    })

  }

  getExpt(dataset_id) {
    if (this.expts.length > 0) {
      console.log(this.expts.filter(d => d['includedInDataset'] === dataset_id))
      return (this.expts.filter(d => d['includedInDataset'] === dataset_id));
    }
  }

}
