import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, ReactiveFormsModule, Validators, FormArray } from '@angular/forms';


import { LabLocationsService, RequestParametersService } from '../../_services';

import { Lab } from '../../_models';

@Component({
  selector: 'app-filter-lab',
  templateUrl: './filter-lab.component.html',
  styleUrls: ['./filter-lab.component.scss']
})

export class FilterLabComponent implements OnInit {
  labs: Lab[];
  labCheckboxes: FormGroup;

  // storeForm: FormGroup;
  // days: Array<string>;
  //
  // emails = [{ email: "email1" }, { email: "email2" }, { email: "email3" }, { email: 'email4' }]
  myForm: FormGroup;


  constructor(private labSvc: LabLocationsService, private formBuilder: FormBuilder, private requestSvc: RequestParametersService ) { }

  ngOnInit() {
    this.labs = this.labSvc.labs;

    this.myForm = this.formBuilder.group({
      labs: this.formBuilder.array([])
    });


    this.myForm.valueChanges.subscribe(val => {
      console.log(val.labs);
      this.requestSvc.updateParams("sample", { field: "lab", value: val.labs })

    })
    //


    // this.initForm();

    // this is useful to iterate over the form group
    // this.days = Object.keys(this.storeForm.controls.availableDays.value);

    // this.storeForm.valueChanges.subscribe(val => {
    //   console.log(val);
    // })
  }

  onChange(lab_id: string, isChecked: boolean) {
    const labFormArray = <FormArray>this.myForm.controls.labs;

    if (isChecked) {
      labFormArray.push(new FormControl(lab_id));
    } else {
      let index = labFormArray.controls.findIndex(x => x.value == lab_id)
      labFormArray.removeAt(index);
    }
  }

  // initForm(): void {
  //   this.storeForm = this.formBuilder.group({
  //     availableDays: this.getAvailableDays()
  //   });
  // }
  //
  // getAvailableDays(): FormGroup {
  //   return this.formBuilder.group({
  //     monday: true,
  //     tuesday: true,
  //     wednesday: true,
  //     thursday: true,
  //     friday: true,
  //     saturday: true,
  //     sunday: true
  //   });
  // }


  // selectLabs(selected) {
  //   console.log("selection")
  //   console.log(selected);
  // }

}
