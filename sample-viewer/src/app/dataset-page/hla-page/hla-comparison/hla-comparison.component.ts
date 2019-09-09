import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatAutocomplete } from '@angular/material';

import { CohortSelectOptions } from '../../../_models';

@Component({
  selector: 'app-hla-comparison',
  templateUrl: './hla-comparison.component.html',
  styleUrls: ['./hla-comparison.component.scss']
})
export class HlaComparisonComponent implements OnInit {
  leftControl = new FormControl();
  leftParams: CohortSelectOptions;
  rightParams: CohortSelectOptions;
  rightControl = new FormControl();

  options: CohortSelectOptions[] = [
    { id: "all", name: "all samples", cohort: ['Lassa', 'Ebola', 'Control'], outcome: ['dead', 'survivor', 'unknown', 'control'] },

    { id: "EBV_survivor", name: "Ebola survivors", cohort: ['Ebola'], outcome: ['survivor'] },
    // FOR NOW: No dead patients w/ Ebola
    // { id: "EBV_dead", name: "Ebola dead", cohort: ['Ebola'], outcome: ['dead'] },
    // { id: "EBV_all", name: "Ebola survivors + dead", cohort: ['Ebola'], outcome: ['dead', 'survivor'] }
    { id: "LSV_survivor", name: "Lassa survivors", cohort: ['Lassa'], outcome: ['survivor'] },
    { id: "LSV_dead", name: "Lassa dead", cohort: ['Lassa'], outcome: ['dead'] },
    { id: "LSV_survivor-dead", name: "Lassa survivors + dead", cohort: ['Lassa'], outcome: ['dead', 'survivor'] },
    { id: "LSV_survivor-unknown", name: "Lassa survivors or unknown outcome", cohort: ['Lassa'], outcome: ['survivor', 'unknown'] },
    { id: "LSV_dead-unknown", name: "Lassa dead or unknown outcome", cohort: ['Lassa'], outcome: ['dead', 'unknown'] },
    { id: "LSV_all", name: "Lassa survivors + dead + unknown outcome", cohort: ['Lassa'], outcome: ['dead', 'survivor', 'unknown'] },

    { id: "control", name: "all control", cohort: ['Control'], outcome: ['control'] },
    { id: "all_survivor", name: "all survivors", cohort: ['Lassa', 'Ebola'], outcome: ['survivor'] },
    { id: "all_dead", name: "all dead", cohort: ['Lassa', 'Ebola'], outcome: ['dead'] },
    { id: "all_survivor-dead", name: "all survivor + dead", cohort: ['Lassa', 'Ebola'], outcome: ['dead', 'survivor'] },
    { id: "control-survivor", name: "control + survivors", cohort: ['Lassa', 'Ebola', 'Control'], outcome: ['survivor', 'control'] },
    // comparisons that probably don't make a ton of sense, or are already specified above b/c of the data
    // { id: "all_unknown", name: "all unknown outcome", cohort: ['Lassa', 'Ebola'], outcome: ['unknown'] },
    // { id: "control-unknown", name: "control + unknown outcome", cohort: ['Lassa', 'Ebola'], outcome: ['unknown', 'control'] },
    // { id: "all_survivor-unknown", name: "survivor + unknown outcome", cohort: ['Lassa', 'Ebola'], outcome: ['survivor', 'unknown'] },
    // { id: "all_dead-unknown", name: "dead + unknown outcome", cohort: ['Lassa', 'Ebola'], outcome: ['dead', 'unknown'] },
    // { id: "all_survivor-unknown-control", name: "all control + survivor + unknown outcome", cohort: ['Lassa', 'Ebola'], outcome: [survivor', 'unknown', 'control'] },
    // { id: "all_dead-unknown-control", name: "all control + dead + unknown outcome", cohort: ['Lassa', 'Ebola'], outcome: ['dead', 'unknown', 'control'] },
    // { id: "all_survivor-dead-control", name: "all control + dead + unknown outcome", cohort: ['Lassa', 'Ebola'], outcome: ['dead', 'survivor', 'control'] },
    // { id: "all_survivor-dead-unknown", name: "all survivor + dead + unknown outcome", cohort: ['Lassa', 'Ebola'], outcome: ['dead', 'survivor', 'unknown'] },
  ];

  init_left: CohortSelectOptions = this.options.filter(d => d.id === "LSV_survivor")[0];
  init_right: CohortSelectOptions = this.options.filter(d => d.id === "control")[0];

  filteredOptionsL: Observable<CohortSelectOptions[]>;
  filteredOptionsR: Observable<CohortSelectOptions[]>;

  @ViewChild(MatAutocomplete) matAutocomplete: MatAutocomplete;


  ngOnInit() {


    this.filteredOptionsL = this.leftControl.valueChanges
      .pipe(
        startWith<string | CohortSelectOptions>(this.init_left),
        map(value => typeof value === 'string' ? value : value.name),
        map(name => name ? this._filter(name) : this.options.slice())
      );

    this.filteredOptionsR = this.rightControl.valueChanges
      .pipe(
        startWith<string | CohortSelectOptions>(this.init_right),
        map(value => typeof value === 'string' ? value : value.name),
        map(name => name ? this._filter(name) : this.options.slice())
      );

    this.leftControl.valueChanges.subscribe(val => {
      if (val.hasOwnProperty("name")) {
        // console.log(val)
        this.leftParams = val;
      }
    });

    this.rightControl.valueChanges.subscribe(val => {
      if (val.hasOwnProperty("name")) {
        // console.log(val)
        this.rightParams = val;
      }
    });

    this.leftControl.setValue(this.init_left);
    this.rightControl.setValue(this.init_right);

  }

  displayFn(cohort?: CohortSelectOptions): string | undefined {
    return cohort ? cohort.name : undefined;
  }

  private _filter(name: string): CohortSelectOptions[] {
    const filterValue = name.toLowerCase();

    return this.options.filter(option => option.name.toLowerCase().includes(filterValue));
  }

  // to auto-select the first option on pressing enter
  chooseFirstOption(): void {
    this.matAutocomplete.options.first.select();
  }

  constructor() { }

}
