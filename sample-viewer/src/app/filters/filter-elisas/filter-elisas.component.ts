import { Component, OnInit, Input } from '@angular/core';

import { FormGroup, FormBuilder } from '@angular/forms';

import { RequestParametersService } from '../../_services';


@Component({
  selector: 'app-filter-elisas',
  templateUrl: './filter-elisas.component.html',
  styleUrls: ['./filter-elisas.component.scss']
})

export class FilterElisasComponent implements OnInit {
  @Input() endpoint: string;

  elisaForm = this.fb.group({
    Ebola: this.fb.group({
      IgG_positive: [true],
      IgG_negative: [true],
      IgG_unknown: [true],
      IgM_positive: [true],
      IgM_negative: [true],
      IgM_unknown: [true],
      Ag_positive: [true],
      Ag_negative: [true],
      Ag_unknown: [true],
    }),

    Lassa: this.fb.group({
      IgG_positive: [true],
      IgG_negative: [true],
      IgG_unknown: [true],
      IgM_positive: [true],
      IgM_negative: [true],
      IgM_unknown: [true],
      Ag_positive: [true],
      Ag_negative: [true],
      Ag_unknown: [true],
    })
  });


  constructor(
    private fb: FormBuilder,
    private requestSvc: RequestParametersService) {
    this.elisaForm.valueChanges.subscribe(val => {
      console.log(val)

      this.requestSvc.updateParams(this.endpoint, { field: 'elisa', value: [val] });
    })
  }

  ngOnInit() {
  }

}
