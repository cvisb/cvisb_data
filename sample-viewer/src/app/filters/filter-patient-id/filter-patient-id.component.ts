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
  loaded_patients: string[] = [];
  bufferSize = 50;
  numberOfItemsFromEndBeforeFetchingMore = 10;
  loading = false;
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
    this.loaded_patients = this.all_patients.slice(0, this.bufferSize);

    switch (this.endpoint) {
      case "patient":
        this.requestSvc.patientParamsState$.subscribe(params => {
          this.checkParams(params);
        })
        break;

      case "sample":
        this.requestSvc.sampleParamsState$.subscribe(params => {
          this.checkParams(params);
        })
        break;
    }
  }

  // Used to reset, when the filters are cleared.
  checkParams(params) {
    if (params.length === 0) {
      this.selectedPatients = null;
    }
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


  // filterContacts(includeContacts: boolean) {
  //   // console.log(includeContacts)
  //   // console.log(this.patients)
  //
  //   if (this.selectedPatients && this.selectedPatients.length > 0) {
  //     if (this.inclContacts) {
  //       this.requestSvc.updateParams(this.endpoint,
  //         {
  //           field: 'patientID', value: this.selectedPatients, orSelector: {
  //             field: 'relatedTo', value: this.selectedPatients
  //           }
  //         });
  //     } else {
  //       this.requestSvc.updateParams(this.endpoint, { field: 'patientID', value: this.selectedPatients });
  //     }
  //   } else {
  //     this.requestSvc.updateParams(this.endpoint, { field: 'patientID', value: null });
  //   }
  // }

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
    console.log(input)
    let parsed = input.split("\,");

    if (parsed.length > 1) {
      parsed = parsed.filter(d => d.length > 0);

      // check that selected patients exists before concatting
      if (!this.selectedPatients) {
        this.selectedPatients = [];
      }

console.log(this.ngSelect)
      // Update the selection to include the typed values.
      this.selectedPatients = this.selectedPatients.concat(parsed);
      // clear the input text
      this.ngSelect.filterValue = null;
      //
      this.filterPatientIDs(this.selectedPatients);
    }
  }

  onScrollToEnd() {
    this.fetchMore();
  }

  onScroll({ end }) {
    if (this.loading || this.all_patients.length <= this.loaded_patients.length) {
      return;
    }

    if (end + this.numberOfItemsFromEndBeforeFetchingMore >= this.loaded_patients.length) {
      this.fetchMore();
    }
  }

  private fetchMore() {
    const len = this.loaded_patients.length;
    const more = this.all_patients.slice(len, this.bufferSize + len);
    this.loading = true;
    // using timeout here to simulate backend API delay
    setTimeout(() => {
      this.loading = false;
      this.loaded_patients = this.loaded_patients.concat(more);
    }, 200)
  }
}
