import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-patient-citations',
  templateUrl: './patient-citations.component.html',
  styleUrls: ['./patient-citations.component.scss']
})

export class PatientCitationsComponent implements OnInit {
  @Input() patientID: string;
  citations: Object[];

  constructor() { }

  ngOnInit() {
  }

}
