import { Component, OnInit, Input, ViewChild } from '@angular/core';

// import { SelectComponent } from '@ng-select/ng-select';

import { AuthState } from '../../_models';

import { RequestParametersService, AuthService } from '../../_services';

@Component({
  selector: 'app-filter-patient-id',
  templateUrl: './filter-patient-id.component.html',
  styleUrls: ['./filter-patient-id.component.scss']
})
export class FilterPatientIdComponent implements OnInit {
  @Input() endpoint: string;
  @Input() patients: string[];
  @Input() all_patients: string[];
  @ViewChild('selectpatients') public ngSelect: any;
  authorized: boolean;

  selectedPatients: string[] = [];
  inclContacts: boolean;
  inclSID: boolean;
  inclGID: boolean;

  constructor(
    private requestSvc: RequestParametersService,
    private authSvc: AuthService
  ) {

    this.authSvc.authState$.subscribe((authState: AuthState) => {
      this.authorized = authState.authorized
    })
  }

  ngOnInit() {
  }



  filterPatientIDs(patientIDs) {
    if (this.inclContacts) {
      this.requestSvc.updateParams(this.endpoint,
        {
          field: 'patientID', value: patientIDs, orSelector: {
            field: 'relatedTo', value: patientIDs
          }
        });
    } else {
      this.requestSvc.updateParams(this.endpoint, { field: 'alternateIdentifier', value: patientIDs });
    }
  }


  filterContacts(includeContacts: boolean) {
    // console.log(includeContacts)
    // console.log(this.patients)

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

  filterID(includeID: boolean, ID_type) {
    // console.log(includeSID)

    if (includeID) {
      this.requestSvc.updateParams(this.endpoint, {
        field: ID_type, value: '_exists_'
      })
    } else {
      this.requestSvc.updateParams(this.endpoint, { field: ID_type, value: null });
    }
  }


  onSearch(input) {
    // console.log(this.ngSelect)
    // console.log(input)
    let parsed = input.term.split("\,");

    if (parsed.length > 1) {
      parsed = parsed.filter(d => d.length > 0)

      // Update the selection to include the typed values.
      this.selectedPatients = this.selectedPatients.concat(parsed);
      // clear the input text
      this.ngSelect.filterValue = null;
      //
      this.filterPatientIDs(this.selectedPatients);
    }
  }



}
