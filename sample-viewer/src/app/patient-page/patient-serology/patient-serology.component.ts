import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-patient-serology',
  templateUrl: './patient-serology.component.html',
  styleUrls: ['./patient-serology.component.scss']
})
export class PatientSerologyComponent implements OnInit {
  @Input() data: Object[];
  @Input() datasetID: string;
  @Input() patientID: string;

  constructor() {
    console.log(datasetID)
  }

  ngOnInit() {
  }
}
