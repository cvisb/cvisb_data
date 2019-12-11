import { Component, OnInit, Input } from '@angular/core';

import { Sample } from '../../_models';

@Component({
  selector: 'app-patient-samples',
  templateUrl: './patient-samples.component.html',
  styleUrls: ['./patient-samples.component.scss']
})
export class PatientSamplesComponent implements OnInit {
  @Input() samples: Sample[];

  constructor() { }

  ngOnInit() {
  }

}
