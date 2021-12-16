import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { ActivatedRoute } from '@angular/router';

import { GetPatientsService, ApiService, AnchorService } from '../_services/';
import { Patient, DataDownload } from '../_models';
import { ExperimentObjectPipe } from '../_pipes/experiment-object.pipe';
import { Observable } from 'rxjs';

import { AuthService } from '../_services';
import { AuthState } from "../_models";

import { flatMapDeep, uniqWith, isEqual } from 'lodash';

@Component({
  selector: 'app-patient-page',
  templateUrl: './patient-page.component.html',
  styleUrls: ['./patient-page.component.scss']
})
export class PatientPageComponent {
  patientID: string;
  patientData$: Observable<any>;
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
  today = new Date();
  privateData: boolean;

  expansionPanelHeight: string = "42px";
  dataPanelHeight: string = "55px";


  constructor(
    private authSvc: AuthService,
    private titleSvc: Title,
    private route: ActivatedRoute,
    private patientSvc: GetPatientsService,
    private apiSvc: ApiService,
    private exptObjPipe: ExperimentObjectPipe
  ) {
    this.authSvc.authState$.subscribe((authState: AuthState) => {
      this.privateData = authState.authorized;
    })

    this.route.params.subscribe(params => {
      this.patientID = params.pid;

      this.titleSvc.setTitle(this.route.snapshot.data.titleStart + this.patientID + this.route.snapshot.data.titleEnd);

      // this.patientData$ = this.patientSvc.getPatientPage(this.patientID);

      // this.patientSvc.getPatient(this.patientID).subscribe((patient) => {
      //   this.patient = patient;

      //   // Double check that altID is an array
      //   if (!Array.isArray(this.patient.alternateIdentifier)) {
      //     this.patient.alternateIdentifier = [this.patient.alternateIdentifier];
      //   }
      //
      //   // set patient title
      //   if (this.patient.gID && this.patient.gID.length > 0) {
      //     this.patient['patientLabel'] = this.patient.gID[0];
      //   } else if (this.patient.sID) {
      //     this.patient['patientLabel'] = this.patient.sID;
      //   } else {
      //     this.patient['patientLabel'] = this.patient.patientID;
      //   }
      // });

      this.apiSvc.getData4Patient('experiment', this.patientID).subscribe(expts => {
        this.expts = expts['hits'];
        console.log(this.expts)

        this.expts.forEach(expt => {
          expt['embargoed'] = expt['releaseDate'] ?
            this.today < new Date(expt['releaseDate']) :
            true;
        })

        let allExpts = this.exptObjPipe.exptDict;
        let dsIDs = this.expts.map(d => d['includedInDataset']);
        this.exptTypes = allExpts.filter(d => dsIDs.includes(d['dataset_id']));
        // this.exptTypes = this.expts.map(d => d['includedInDataset']);
        console.log(this.expts)
        console.log(this.exptTypes)

        this.publications = uniqWith(flatMapDeep(expts['hits'], d => d.citation).filter(d => d), isEqual);
      })
    })

  }
// }
  ngOnInit() {
    this.patientID = this.route.snapshot.params.pid;
    this.patientData$ = this.patientSvc.getPatientPage(this.patientID);

    this.titleSvc.setTitle(this.route.snapshot.data.titleStart + this.patientID + this.route.snapshot.data.titleEnd);
  }

  getExpt(dataset_id) {
    if (this.expts.length > 0) {
      return (this.expts.filter(d => d['includedInDataset'] === dataset_id));
    }
  }

  getPrelim(dataset_id): string {
    let filtered_expts = this.expts.filter(d => d['includedInDataset'] === dataset_id);
    let final = filtered_expts.every((d: any) => d.dataStatus === "final");
    return (final ? "final" : "preliminary")
  }

  // returns T/F for if any of the experiments are embargoed.
  getEmbargoed(dataset_id): boolean {
    return (this.expts.filter(d => d['includedInDataset'] === dataset_id).some((d: any) => d.embargoed === true)
    )
  }

  downloadAllData() {
    console.log(this.expts)
    console.log(this.patientData$)
  }

  // collapses array of ELISA results down.
  // getELISA(returnVar: string): Object {
  //   // let elisa = this.patient.elisa;
  //   // if (elisa) {
  //   //   let summary = {};
  //   //   let final = elisa.every((d: any) => d.dataStatus === "final");
  //   //
  //   //   summary['correction'] = elisa.map(d => d.correction).filter(d => d);
  //   //   if (summary['correction'].length === 0) {
  //   //     summary['correction'] = null;
  //   //   }
  //   //   summary['citation'] = elisa.map(d => d.citation).filter(d => d);
  //   //   summary['dataStatus'] = final ? "final" : "preliminary";
  //
  //     // switch (returnVar) {
  //     //   case "correction":
  //     //     return (summary["correction"]);
  //     //   case "citation":
  //     //     return (summary["citation"]);
  //     //   case "dataStatus":
  //     //     return (summary["dataStatus"]);
  //     //   default:
  //     //     return (summary)
  //     // }
  //   }
  //   return (null)


}
