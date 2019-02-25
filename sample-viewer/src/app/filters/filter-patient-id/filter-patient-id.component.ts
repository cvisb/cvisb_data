import { Component, OnInit, Input, ViewChild } from '@angular/core';

// import { SelectComponent } from '@ng-select/ng-select';


import { RequestParametersService } from '../../_services';

@Component({
  selector: 'app-filter-patient-id',
  templateUrl: './filter-patient-id.component.html',
  styleUrls: ['./filter-patient-id.component.scss']
})
export class FilterPatientIdComponent implements OnInit {
  @Input() endpoint: string;
  @Input() patients: string[];
  @ViewChild('selectpatients') public ngSelect: any;

  selectedPatients: string[] = [];
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
      this.requestSvc.updateParams(this.endpoint, { field: 'patientID', value: null });
    }
  }


  onSearch(input) {
    console.log(this.ngSelect)
    console.log(input)
    let parsed = input.split("\,");

    if (parsed.length > 1) {
      // Update the selection to include the typed values.
      this.selectedPatients = this.selectedPatients.concat(parsed);
      // clear the input text
      this.ngSelect.filterValue = "";
    }
  }



}
