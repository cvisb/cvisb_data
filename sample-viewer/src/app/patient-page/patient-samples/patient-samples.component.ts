import { Component, OnInit, Input } from '@angular/core';

import { Patient } from '../../_models';

@Component({
  selector: 'app-patient-samples',
  templateUrl: './patient-samples.component.html',
  styleUrls: ['./patient-samples.component.scss']
})
export class PatientSamplesComponent implements OnInit {
  @Input() patient: Patient;

  constructor() { }

  ngOnInit() {
  }

}
