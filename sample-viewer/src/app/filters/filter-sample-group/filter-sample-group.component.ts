import { Component, OnInit } from '@angular/core';

import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';

import { RequestParametersService } from '../../_services';


@Component({
  selector: 'app-filter-sample-group',
  templateUrl: './filter-sample-group.component.html',
  styleUrls: ['./filter-sample-group.component.scss']
})
export class FilterSampleGroupComponent implements OnInit {

  sampleGroupChecks: FormGroup = this.fb.group({
    acute: true,
    survivor: true
  });

  constructor(
    private fb: FormBuilder,
    private requestSvc: RequestParametersService
  ) {
    this.sampleGroupChecks.valueChanges.subscribe(val => {
      let sampleGrps = [];
      if(val.acute) {
        sampleGrps.push("acute");
      }

      if(val.survivor) {
        sampleGrps.push("survivor");
      }

      this.requestSvc.updateParams("sample", { field: "sampleGroup", value: sampleGrps });
    })
  }

  ngOnInit() {

  }

}
