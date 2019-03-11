import { Component, OnInit, Input } from '@angular/core';

import { Patient } from '../../_models';

@Component({
  selector: 'app-patient-relationships',
  templateUrl: './patient-relationships.component.html',
  styleUrls: ['./patient-relationships.component.scss']
})

export class PatientRelationshipsComponent implements OnInit {
  @Input() patient: Patient;
  constructor() { }

  ngOnInit() {
  }

}
