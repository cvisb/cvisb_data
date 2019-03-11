import { Component, OnInit, Input } from '@angular/core';

import { Patient } from '../../_models';

@Component({
  selector: 'app-patient-symptoms',
  templateUrl: './patient-symptoms.component.html',
  styleUrls: ['./patient-symptoms.component.scss']
})

export class PatientSymptomsComponent implements OnInit {
    @Input() patient: Patient;

  constructor() { }

  ngOnInit() {
  }

}
