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
    if (this.patient && this.patient.symptoms) {
      this.patient.symptoms.forEach(d =>
        this.symptom_keys = this.symptom_keys.concat(this.symptom_keys, Object.keys(d['symptoms'])));
    }
  }

}
