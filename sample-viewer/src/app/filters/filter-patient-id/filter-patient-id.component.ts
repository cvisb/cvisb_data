import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';

import { Observable, Subscription } from 'rxjs';
import { AuthState } from '../../_models';

import { RequestParametersService, AuthService } from '../../_services';

@Component({
  selector: 'app-filter-patient-id',
  templateUrl: './filter-patient-id.component.html',
  styleUrls: ['./filter-patient-id.component.scss']
})
export class FilterPatientIdComponent implements OnInit, OnDestroy {
  @Input() endpoint: string;
  @Input() patients: string[];
  @Input() all_patients: string[];
  loaded_patients: string[] = [];
  bufferSize = 50;
  numberOfItemsFromEndBeforeFetchingMore = 10;
  loading = false;
  @ViewChild('selectpatients', { static: false }) public ngSelect: any;
  authorized$: Observable<AuthState>;

  selectedPatients: string[] = [];
  inclContacts: boolean;
  inclSID: boolean;
  inclGID: boolean;

  patientSubscription: Subscription;
  sampleSubscription: Subscription;

  constructor(
    private requestSvc: RequestParametersService,
    private authSvc: AuthService
  ) {
    this.authorized$ = this.authSvc.authState$;
  }

  ngOnInit() {
    if (this.all_patients && this.all_patients.length > 0) {
      this.loaded_patients = this.all_patients.slice(0, this.bufferSize);
    }

    switch (this.endpoint) {
      case "patient":
        this.patientSubscription = this.requestSvc.patientParamsState$.subscribe(params => {
          this.checkParams(params);
        })
        break;

      case "sample":
        this.sampleSubscription = this.requestSvc.sampleParamsState$.subscribe(params => {
          this.checkParams(params);
        })
        break;
    }
  }

  ngOnDestroy() {
    this.patientSubscription.unsubscribe();
    this.sampleSubscription.unsubscribe();
  }

  // Used to reset, when the filters are cleared.
  checkParams(params) {
    if (params.length === 0) {
      this.selectedPatients = null;
    }
  }


  filterPatientIDs(patientIDs: string[]) {
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
    let parsed = input.term.split("\,");

    if (parsed.length > 1) {
      parsed = parsed.filter(d => d.length > 0);
      parsed = parsed.map((d: string) => d.trim());

      // check that selected patients exists before concatting
      if (!this.selectedPatients) {
        this.selectedPatients = [];
      }

      // Update the selection to include the typed values.
      this.selectedPatients = this.selectedPatients.concat(parsed);
      // clear the input text
      // this.ngSelect.filterValue = null;
      // this.ngSelect.active = [];

      // this.ngSelect.remove(input);
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
