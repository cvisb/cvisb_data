import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-stepper',
  templateUrl: './add-stepper.component.html',
  styleUrls: ['./add-stepper.component.scss']
})

export class AddStepperComponent implements OnInit {
  patientsFormGroup: FormGroup;
  patientReviewFormGroup: FormGroup;
  samplesFormGroup: FormGroup;

  constructor(private _formBuilder: FormBuilder, ) { }

  ngOnInit() {
    this.patientsFormGroup = this._formBuilder.group({
      patientsCtrl: ['', Validators.required],
      dateCtrl: ['', Validators.required]
    });

    this.patientReviewFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });

    this.samplesFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
  }
}
