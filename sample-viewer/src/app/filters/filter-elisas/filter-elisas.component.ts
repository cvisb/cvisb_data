import { Component, OnInit, Input } from '@angular/core';

import { FormGroup, FormBuilder, FormArray } from '@angular/forms';

import { RequestParametersService } from '../../_services';


@Component({
  selector: 'app-filter-elisas',
  templateUrl: './filter-elisas.component.html',
  styleUrls: ['./filter-elisas.component.scss']
})

export class FilterElisasComponent implements OnInit {
  @Input() endpoint: string;

  viruses: string[] = ["Ebola", "Lassa"];
  assays: string[] = ["IgG", "IgM", "Ag"];
  results: string[] = ["positive", "negative", "unknown"];
  timepoints: string[] = ["patient admission", "survivor enrollment"];

  elisaForm: FormGroup = this.fb.group({
    elisaGroups: this.fb.array([this.createGroup()])
  });

  elisaGrps: FormArray;

  // expanded from https://alligator.io/angular/reactive-forms-formarray-dynamic-fields/
  // and https://medium.com/aubergine-solutions/add-push-and-remove-form-fields-dynamically-to-formarray-with-reactive-forms-in-angular-acf61b4a2afe
  constructor(
    private fb: FormBuilder,
    private requestSvc: RequestParametersService) {
    this.elisaForm.valueChanges.subscribe(val => {
      console.log(val.elisaGrps)
      // hard reset of params; otherwise ELISA has a "AND" issue
      this.requestSvc.patientParamsSubject.next([]);
      // this.requestSvc.updateParams(this.endpoint, { field: 'elisa', value: val.elisaGroups });
    })
  }

  ngOnInit() {
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

  // Get method to grab the formArray within formGroup
  // https://github.com/angular/angular-cli/issues/6099#issuecomment-297982698
  get elisaArray() {
    return this.elisaForm.get('elisaGroups') as FormArray;;
  }

  createGroup(): FormGroup {
    return this.fb.group({
      virus: [[]],
      assayType: [[]],
      ELISAresult: [[]],
      timepoint: [[]],
      connector: "and"
    });
  }

  addELISA() {
    this.elisaGrps = this.elisaArray;
    this.elisaGrps.push(this.createGroup());
  }

  deleteELISA($event, idx) {
    this.elisaGrps = this.elisaArray;
    // Remove the elisa group from the array
    this.elisaGrps.removeAt(idx);
  }

  // Used to reset, when the filters are cleared.
  checkParams(params) {
    if (params.length === 0) {
      this.elisaGrps = this.elisaArray;

      // clear
      for (let i = 0; i < this.elisaGrps.length; i++) {
        this.elisaGrps.removeAt(i);
      }

      // re-intialize
      this.elisaGrps.push(this.createGroup());
    }
  }

}
