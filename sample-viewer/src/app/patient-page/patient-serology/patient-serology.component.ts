import { Component, OnInit, Input, OnChanges } from '@angular/core';

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
  }

  ngOnInit() {
  }

  ngOnChanges() {
    console.log(this.data)
    console.log(this.patientID)
    console.log(this.datasetID)
  }
}
