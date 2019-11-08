import { Component, OnInit, Input } from '@angular/core';

import { AuthService } from '../../_services';
import { AuthState } from "../../_models";

@Component({
  selector: 'app-patient-warning',
  templateUrl: './patient-warning.component.html',
  styleUrls: ['./patient-warning.component.scss']
})

export class PatientWarningComponent implements OnInit {
  @Input() patientStatus: string;
  @Input() expts: Object[];
  embargoed: boolean = true;
  preliminary: boolean = true;
  privateData: boolean;

  constructor(private authSvc: AuthService) { }

  ngOnInit() {
    // this.embargoed = this.expts.some((d: any) => d.embargoed === true);
    this.preliminary = (this.patientStatus === "preliminary") || (this.expts.some((d: any) => d.dataStatus === "preliminary"));

    this.authSvc.authState$.subscribe((authState: AuthState) => {
      this.privateData = authState.authorized;
    })

  }

}
