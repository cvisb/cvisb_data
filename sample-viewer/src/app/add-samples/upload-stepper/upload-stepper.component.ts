import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatStepper } from '@angular/material';

import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

import { SampleUploadService } from '../../_services';

@Component({
  selector: 'app-upload-stepper',
  templateUrl: './upload-stepper.component.html',
  styleUrls: ['./upload-stepper.component.scss']
})

export class UploadStepperComponent implements OnInit {
  steps: Object[];
  firstFormGroup: FormGroup;
  formGroup: FormGroup;
  previewData: Object[];
  @ViewChild('sample_upload_stepper', { static: false }) stepper: MatStepper;


  constructor(
    private uploadSvc: SampleUploadService,
    private _formBuilder: FormBuilder) {

    uploadSvc.uploadSamplesState$.subscribe((data) => {
      this.previewData = data;
    })

    uploadSvc.progressState$.subscribe((progress) => {
      this.steps = progress;
      // console.log(progress)
    })

    uploadSvc.progressState2$.subscribe((progress) => {
      // console.log("PROGRESS!")
      // console.log(progress);
      if (this.firstFormGroup) {
        this.firstFormGroup.patchValue({ upload: true });
      }
      // console.log(this.firstFormGroup)

    })
  }

  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      upload: [null, Validators.requiredTrue]
    });

    // console.log(this.formGroup)
  }

  ngAfterViewInit() {
    // this.firstFormGroup.patchValue({file: true});
    // this.firstFormGroup.controls['file'].setValue(true);

    // Make sure stepper exists before trying to set the page number
    this.uploadSvc.uploadStepState$.subscribe((stepNum) => {
      // console.log("step num: " + stepNum)
      this.stepper.selectedIndex = stepNum + 1;
      // console.log(this.stepper)
    })
  }

}
