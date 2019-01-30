import { Component, OnInit, Input } from '@angular/core';

import { Patient } from '../../_models';

@Component({
  selector: 'app-patient-related',
  templateUrl: './patient-related.component.html',
  styleUrls: ['./patient-related.component.scss']
})
export class PatientRelatedComponent implements OnInit {
  @Input() patient: Patient;

  constructor() { }

  ngOnInit() {
  }

}
