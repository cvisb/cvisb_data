import { Component, OnInit, Input } from '@angular/core';

import { Sample } from '../../_models';

@Component({
  selector: 'app-patient-timepoints',
  templateUrl: './patient-timepoints.component.html',
  styleUrls: ['./patient-timepoints.component.scss']
})

export class PatientTimepointsComponent implements OnInit {
  @Input() samples: Sample[];
  constructor() { }

  ngOnInit() {
  }

}
