import { Component, OnInit, Input } from '@angular/core';

import { Patient, AuthState} from '../../_models';

import { AuthService } from '../../_services';

@Component({
  selector: 'app-patient-dates',
  templateUrl: './patient-dates.component.html',
  styleUrls: ['./patient-dates.component.scss']
})
export class PatientDatesComponent implements OnInit {

  authorized: boolean;

  @Input() patient: Patient;

  constructor(public authSvc: AuthService) { 
    authSvc.authState$.subscribe((authState: AuthState) => {
      this.authorized = authState.authorized;
    })
  }

  ngOnInit() {
  }

}
