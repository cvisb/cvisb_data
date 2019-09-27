import { Component, OnInit, Input } from '@angular/core';

import { Patient } from '../../_models';

@Component({
  selector: 'app-patient-demographics',
  templateUrl: './patient-demographics.component.html',
  styleUrls: ['./patient-demographics.component.scss']
})
export class PatientDemographicsComponent implements OnInit {
  @Input() patient: Patient;

  constructor() {
  }

  ngOnInit() {
    console.log(this.patient)
  }

}
