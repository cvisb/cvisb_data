import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-add-samples',
  templateUrl: './add-samples.component.html',
  styleUrls: ['./add-samples.component.scss']
})
export class AddSamplesComponent implements OnInit {
  patientsFormGroup: FormGroup;
  patientReviewFormGroup: FormGroup;
  samplesFormGroup: FormGroup;

  constructor(
    private _formBuilder: FormBuilder,
    private titleSvc: Title,
    private route: ActivatedRoute
  ) {
    this.titleSvc.setTitle(this.route.snapshot.data.title)
  }

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
