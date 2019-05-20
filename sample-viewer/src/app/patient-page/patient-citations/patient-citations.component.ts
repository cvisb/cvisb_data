import { Component, OnInit, Input } from '@angular/core';

import { Citation } from '../../_models';

@Component({
  selector: 'app-patient-citations',
  templateUrl: './patient-citations.component.html',
  styleUrls: ['./patient-citations.component.scss']
})

export class PatientCitationsComponent implements OnInit {
  @Input() publications: Citation[];

  constructor() { }

  ngOnInit() {
    console.log(this.publications)
  }

}
