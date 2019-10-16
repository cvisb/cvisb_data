import { Component, OnInit, Input } from '@angular/core';

import { Patient } from '../../_models';

@Component({
  selector: 'app-patient-serology',
  templateUrl: './patient-serology.component.html',
  styleUrls: ['./patient-serology.component.scss']
})
export class PatientSerologyComponent implements OnInit {
  @Input() patient: Patient;
  data: Object[];

  files: string[] = ['systems_serology.csv']

  constructor() { }

  ngOnInit() {
    let serology: any;
    if (this.patient.availableData) {
      serology = this.patient.availableData.filter((d: any) => d.identifier === 'systems-serology');
      this.data = serology.length === 1 ? serology[0]['data'] : null;
    } else {
      this.data = null;
    }
  }

}
