import { Component, OnInit, Input } from '@angular/core';


@Component({
  selector: 'app-filter-patient-id',
  templateUrl: './filter-patient-id.component.html',
  styleUrls: ['./filter-patient-id.component.scss']
})
export class FilterPatientIdComponent implements OnInit {
  @Input() patients: string[];

  selectedPatients: string[];

  constructor() { }

  ngOnInit() {
  }

}
