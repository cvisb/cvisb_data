import { Component, OnInit, Input } from '@angular/core';

import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';

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
      this.requestSvc.updateParams(this.endpoint, { field: 'elisa', value: val.elisaGroups });
    })
  }

  ngOnInit() {
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
    this.elisaGrps = this.elisaForm.get('elisaGroups') as FormArray;
    this.elisaGrps.push(this.createGroup());
  }

  deleteELISA($event, idx) {
    this.elisaGrps = this.elisaForm.get('elisaGroups') as FormArray;
    // Remove the elisa group from the array
    this.elisaGrps.removeAt(idx);
  }


}
