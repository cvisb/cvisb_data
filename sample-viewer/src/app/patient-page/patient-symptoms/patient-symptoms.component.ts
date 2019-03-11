import { Component, OnInit, Input } from '@angular/core';

import { Patient } from '../../_models';

@Component({
  selector: 'app-patient-symptoms',
  templateUrl: './patient-symptoms.component.html',
  styleUrls: ['./patient-symptoms.component.scss']
})

export class PatientSymptomsComponent implements OnInit {
  @Input() patient: Patient;
  symptom_keys: string[] = [];

  constructor() { }

  ngOnInit() {
    console.log(this.patient);
    if (this.patient && this.patient.symptoms) {
      console.log(this.patient.symptoms)
      this.patient.symptoms.forEach(d =>
        this.symptom_keys = this.symptom_keys.concat(this.symptom_keys, Object.keys(d['symptoms'])));
    }
  }

}
