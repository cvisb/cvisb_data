import { Component, OnInit, Input } from '@angular/core';

import { Patient } from '../../_models';

import { faLock } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-patient-demographics',
  templateUrl: './patient-demographics.component.html',
  styleUrls: ['./patient-demographics.component.scss']
})

export class PatientDemographicsComponent implements OnInit {
  @Input() patient: Patient;
  faLock = faLock;

  constructor() {
  }

  ngOnInit() {
  }

}
