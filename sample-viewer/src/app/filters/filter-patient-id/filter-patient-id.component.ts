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
  states: any;

  constructor(private requestSvc: RequestParametersService) { }

  ngOnInit() {
    console.log(this.states)
  }

  filterPatientIDs(patientIDs) {
    console.log(patientIDs);
    console.log(this.states)


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

    if (this.selectedPatients && this.selectedPatients.length > 0) {
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
    } else {
        this.requestSvc.updateParams(this.endpoint, { field: 'patientID', value: null});
    }
  }

  onAdd(e){
    console.log('add')
    console.log(e)
    console.log(this.states)
  }
onFocus(e){
    console.log('focus')
    console.log(e)
    console.log(this.states)
  }

onSearch(e){
  console.log('search')
  console.log(e)
  console.log(this.states)
}

onBlur(e){
  console.log('blur')
  console.log(e)
  console.log(this.states)
}

onChange(e){
  console.log('change')
  console.log(e)
  console.log(this.states)
}


}
