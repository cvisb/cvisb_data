import { Component, OnInit, Input, ViewChild, OnDestroy, ElementRef } from '@angular/core';

import { Observable, Subscription } from 'rxjs';
import { AuthState } from '../../_models';
import { COMMA, ENTER, SPACE } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { map, startWith } from 'rxjs/operators';
import { cloneDeep } from 'lodash';

import { RequestParametersService, AuthService, CheckIdsService } from '../../_services';

@Component({
  selector: 'app-filter-patient-id',
  templateUrl: './filter-patient-id.component.html',
  styleUrls: ['./filter-patient-id.component.scss']
})
export class FilterPatientIdComponent implements OnInit, OnDestroy {
  @Input() endpoint: string;
  @Input() all_patients: string[];
  @ViewChild('idInput') idInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  loading = false;
  authorized$: Observable<AuthState>;

  // autocomplete
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA, SPACE];
  idCtrl = new FormControl();
  filteredIDs: Observable<string[]>;
  selectedIDs: string[] = [];
  num2Display: number = 6;

  // G- or S- id checkboxes
  inclContacts: boolean;
  inclSID: boolean;
  inclGID: boolean;

  // subscription tracking
  patientSubscription: Subscription;
  sampleSubscription: Subscription;

  constructor(
    private requestSvc: RequestParametersService,
    private authSvc: AuthService,
    private idSvc: CheckIdsService
  ) {
    this.authorized$ = this.authSvc.authState$;

    // listen for typing changes in ID field dynamically to filter as type
    this.filteredIDs = this.idCtrl.valueChanges.pipe(
      startWith(null),
      map((id: string | null) => id ? this._filter(id) : (this.all_patients ? this.all_patients.slice(0, this.num2Display) : null)));
  }

  ngOnInit() {
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
    if (this.patientSubscription) {
      this.patientSubscription.unsubscribe();
    }
    if (this.sampleSubscription) {
      this.sampleSubscription.unsubscribe();
    }
  }

  // type to add a mat-chip
  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add an ID
    if ((value || '').trim()) {
      // If a string of IDs is copy / pasted, split by spaces or commas and add to array
      this.selectedIDs = this.selectedIDs.concat(value.split(/\s+/).flatMap(d => d.split(",")).map(d => d.trim()).filter(d => d && d !== ""));
    }

    // Reset the input value
    if (input) {
      input.value = null;
      // input.value = "";
    }

    this.idCtrl.setValue(null);

    // execute the search
    this.executeSearch(this.selectedIDs)
  }

  // remove a selected option
  remove(id: string): void {
    const index = this.selectedIDs.indexOf(id);

    if (index >= 0) {
      this.selectedIDs.splice(index, 1);
    }
    // execute the search
    this.executeSearch(this.selectedIDs)
  }

  // Select from the list of options
  selected(event: MatAutocompleteSelectedEvent): void {
    this.selectedIDs.push(event.option.viewValue);
    // execute the search
    this.executeSearch(this.selectedIDs)
    // this.idInput.nativeElement.value = "";
    this.idInput.nativeElement.value = null;
    this.idCtrl.setValue(null);
  }

  // Filter down the autocomplete options
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return (this.all_patients.filter(id => id && id.toLowerCase().indexOf(filterValue) > -1).slice(0, this.num2Display));
  }

  // Used to reset, when the filters are cleared.
  checkParams(params) {
    if (params.length === 0) {
      this.selectedIDs = [];
    }
  }

  // Executes the search
  executeSearch(patientIDs: string[]) {
    let ids = cloneDeep(patientIDs);

    // Add in additional aliases for the id
    ids.forEach(d => {
      let correctedID = this.idSvc.checkPatientID(d);
      if (correctedID.status !== 200 && correctedID.id) {
        ids.push(correctedID.id);
      }
    })

    if (this.inclContacts) {
      this.requestSvc.updateParams(this.endpoint,
        {
          field: 'patientID', value: ids, orSelector: {
            field: 'relatedTo', value: ids
          }
        });
    } else {
      this.requestSvc.updateParams(this.endpoint, { field: 'alternateIdentifier', value: ids });
    }
  }


  // filterContacts(includeContacts: boolean) {
  //   // console.log(includeContacts)
  //   // console.log(this.patients)
  //
  //   if (this.selectedIDs && this.selectedIDs.length > 0) {
  //     if (this.inclContacts) {
  //       this.requestSvc.updateParams(this.endpoint,
  //         {
  //           field: 'patientID', value: this.selectedIDs, orSelector: {
  //             field: 'relatedTo', value: this.selectedIDs
  //           }
  //         });
  //     } else {
  //       this.requestSvc.updateParams(this.endpoint, { field: 'patientID', value: this.selectedIDs });
  //     }
  //   } else {
  //     this.requestSvc.updateParams(this.endpoint, { field: 'patientID', value: null });
  //   }
  // }

  // Filter ID type if it exists
  filterIDExists(includeID: boolean, ID_type: string) {
    if (includeID) {
      this.requestSvc.updateParams(this.endpoint, {
        field: ID_type, value: '_exists_'
      })
    } else {
      this.requestSvc.updateParams(this.endpoint, { field: ID_type, value: null });
    }
  }

}
