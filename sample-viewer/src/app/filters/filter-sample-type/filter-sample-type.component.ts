import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, FormControl, ReactiveFormsModule, Validators, FormArray } from '@angular/forms';


import { RequestParametersService } from '../../_services';


@Component({
  selector: 'app-filter-sample-type',
  templateUrl: './filter-sample-type.component.html',
  styleUrls: ['./filter-sample-type.component.scss']
})

export class FilterSampleTypeComponent implements OnInit {
  sample_types: string[] = ['frozenPBMC-DNA', 'frozenPBMC-RNA', 'plasma', 'PBMC'].sort();

  myForm: FormGroup;

  interestFormGroup: FormGroup
  interests: any;
  selected: any;
  include_empty_samples: boolean = true;

  constructor(private formBuilder: FormBuilder, private requestSvc: RequestParametersService) {
    //
    //   this.requestSvc.sampleParamsState$.subscribe(params => {
    //     console.log(params)
    //     console.log(this.interestFormGroup)
    //
    //
    //   })
  }

  ngOnInit() {

    //   const arr = new FormArray([
    //     new FormControl(),
    //     new FormControl()
    //   ]);
    //
    //   arr.setValue(['Nancy', 'Drew']);
    //   arr.patchValue(['Nancy', 'Drew']);
    //
    this.myForm = this.formBuilder.group({
      samples: this.formBuilder.array([])
    });
    //
    this.myForm.valueChanges.subscribe(val => {
      this.requestSvc.updateParams("sample", { field: "sampleType", value: val.samples })
    })
    //
    //   this.interestFormGroup = this.formBuilder.group({
    //     interests: this.formBuilder.array([])
    //   });
    //
    //   // Initialize values.
    //   this.interests = this.sample_types;
    //   this.interestFormGroup.patchValue({ interests: ["PBMC"] })
    //   this.interestFormGroup.patchValue({ interests: ["PBMC"] })
    //
    //
    //   const existingItems = this.interestFormGroup.get("interests") as FormArray;
    //   console.log(existingItems)
    //   // existingItems.at(0).patchValue(["PBMC"]);
    //   existingItems.patchValue(["PBMC"]);
    //
    //   this.requestSvc.updateParams("sample", { field: "sampleType", value: this.sample_types })
    //   console.log(this.interestFormGroup)
    //
    // }
    //
    // onChange(event) {
    //   const interests = <FormArray>this.interestFormGroup.get('interests') as FormArray;
    //
    //   if (event.checked) {
    //     interests.push(new FormControl(event.source.value))
    //   } else {
    //     const i = interests.controls.findIndex(x => x.value === event.source.value);
    //     interests.removeAt(i);
    //   }
    //
    //   console.log(this.interestFormGroup.value);
  }

  onChange(type: string, isChecked: boolean) {
    const sampleFormArray = <FormArray>this.myForm.controls.samples;

    if (isChecked) {
      sampleFormArray.push(new FormControl(type));
    } else {
      let index = sampleFormArray.controls.findIndex(x => x.value == type)
      sampleFormArray.removeAt(index);
    }
  }

  filterEmptySamples(value) {
    if (value) {
      this.requestSvc.updateParams("sample", { field: "location.numAliquots", value: ["[0 TO *]"] })
    } else {
      this.requestSvc.updateParams("sample", { field: "location.numAliquots", value: ["[1 TO *]"] })
    }

  }

}
