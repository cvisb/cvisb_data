import { Component, OnInit, Input } from '@angular/core';

import { RequestParametersService } from '../../_services';

@Component({
  selector: 'app-filter-patient-id',
  templateUrl: './filter-patient-id.component.html',
  styleUrls: ['./filter-patient-id.component.scss']
})
export class FilterPatientIdComponent implements OnInit {
  @Input() endpoint: string;
  @Input() patients: string[];

  selectedPatients: string[];

  constructor(private requestSvc: RequestParametersService) { }

  ngOnInit() {
  }

  filterPatientIDs(ids) {
    console.log(ids);
    this.requestSvc.updateParams(endpoint, { field: 'patientID', value: ids })
  }

}
