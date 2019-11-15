import { Component, OnInit, Input } from '@angular/core';

import { AuthService } from '../../_services';
import { AuthState, Patient } from "../../_models";

@Component({
  selector: 'app-patient-warning',
  templateUrl: './patient-warning.component.html',
  styleUrls: ['./patient-warning.component.scss']
})

export class PatientWarningComponent implements OnInit {
  @Input() patient: Patient;
  @Input() expts: Object[];
  embargoed: boolean = true;
  preliminary: boolean = true;
  privateData: boolean;

  constructor(private authSvc: AuthService) { }

  ngOnInit() {
    // this.embargoed = this.expts.some((d: any) => d.embargoed === true);
    let patient_prelim = (this.patient.dataStatus === "preliminary");
    let elisa_prelim = this.patient.elisa ? !(this.patient.elisa.every((d: any) => d.dataStatus == "final")) : false;
    let expt_prelim = !(this.expts.every((d: any) => d.dataStatus === "final"));
    this.preliminary = patient_prelim ||
      elisa_prelim ||
      expt_prelim;

    this.authSvc.authState$.subscribe((authState: AuthState) => {
      this.privateData = authState.authorized;
    })

  }

}
