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
  inclContacts: boolean;

  constructor(private requestSvc: RequestParametersService) { }

  ngOnInit() {
  }

  filterPatientIDs(patientIDs) {
    console.log(patientIDs);


    if (this.inclContacts) {
      this.requestSvc.updateParams(this.endpoint,
        {
          field: 'patientID', value: patientIDs, orSelector: {
            field: 'relatedTo', value: patientIDs
          }
        });
    } else {
      this.requestSvc.updateParams(this.endpoint, { field: 'patientID', value: patientIDs });
    }
  }


  filterContacts(includeContacts: boolean) {
    console.log(includeContacts)
    console.log(this.patients)

    if (this.selectedPatients.length > 0) {
      if (this.inclContacts) {
        this.requestSvc.updateParams(this.endpoint,
          {
            field: 'patientID', value: this.selectedPatients, orSelector: {
              field: 'relatedTo', value: this.selectedPatients
            }
          });
      } else {
        this.requestSvc.updateParams(this.endpoint, { field: 'patientID', value: this.selectedPatients });
      }
    }
  }


}
