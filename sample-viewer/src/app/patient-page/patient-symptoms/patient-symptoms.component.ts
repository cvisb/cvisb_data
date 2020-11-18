import { Component, OnChanges, Input } from '@angular/core';

import { Patient } from '../../_models';

@Component({
  selector: 'app-patient-symptoms',
  templateUrl: './patient-symptoms.component.html',
  styleUrls: ['./patient-symptoms.component.scss']
})

export class PatientSymptomsComponent implements OnChanges {
  @Input() patient: Patient;
  symptom_keys: string[] = [];

  constructor() { }

  ngOnChanges() {
    this.symptom_keys = [];
    console.log(this.patient)
    if (this.patient && this.patient.symptoms) {
      this.symptom_keys = Object.keys(this.patient.symptoms);
    }
  }
}
