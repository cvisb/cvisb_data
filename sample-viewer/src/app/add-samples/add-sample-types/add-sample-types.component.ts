import { Component, OnInit } from '@angular/core';

import { LabLocationsService } from '../../_services/';
import { Lab } from '../../_models/';

@Component({
  selector: 'app-add-sample-types',
  templateUrl: './add-sample-types.component.html',
  styleUrls: ['./add-sample-types.component.scss']
})
export class AddSampleTypesComponent implements OnInit {
  checked: boolean = false;
  checked2: boolean = false;
  selected_lab: Lab;
  selected_dilution: string;
  selected_source: string;
  selected_buffer: string;
  avl: boolean;

  labs: Lab[];

  lab;
  num_aliquots: number;

  sampleTypes: Object = [
    // {'name': 'plasma', 'protocol'}
  ]

  constructor(private labSvc: LabLocationsService) {
    this.labs = labSvc.getLabs();
   }

  ngOnInit() {

  }

}
