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
    if (this.patient && this.patient.symptoms) {
      this.symptom_keys = this.patient.symptoms.flatMap(d => Object.keys(d));
      this.symptom_keys = this.symptom_keys.filter(d => !["@type", "timepoint"].includes(d))
    }
  }
}
