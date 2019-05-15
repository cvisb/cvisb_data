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

  constructor(private formBuilder: FormBuilder, private requestSvc: RequestParametersService ) { }

  ngOnInit() {
    this.myForm = this.formBuilder.group({
      samples: this.formBuilder.array([])
    });

    this.myForm.valueChanges.subscribe(val => {
      this.requestSvc.updateParams("sample", { field: "sampleType", value: val.samples })
    })

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

}
