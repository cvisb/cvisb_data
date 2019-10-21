import { Component, OnInit, Input } from '@angular/core';

import { Patient } from '../../_models';

@Component({
  selector: 'app-patient-serology',
  templateUrl: './patient-serology.component.html',
  styleUrls: ['./patient-serology.component.scss']
})
export class PatientSerologyComponent implements OnInit {
  @Input() data: Object[];
  @Input() files;

  constructor() { }

  ngOnInit() {
  }
}
