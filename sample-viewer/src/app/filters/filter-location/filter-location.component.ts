import { Component, OnChanges, OnInit, Input, OnDestroy } from '@angular/core';

import { RequestParametersService } from '../../_services';
import { Subscription } from 'rxjs';
import { flatMapDeep } from 'lodash';

@Component({
  selector: 'app-filter-location',
  templateUrl: './filter-location.component.html',
  styleUrls: ['./filter-location.component.scss']
})

export class FilterLocationComponent implements OnInit, OnChanges, OnDestroy {
  @Input() countries: any[];
  @Input() all_countries: AnalyserOptions[];
  @Input() endpoint: string;
  patientSubscription: Subscription;
  sampleSubscription: Subscription;

  params;

  constructor(private requestSvc: RequestParametersService) {
  }

  ngOnInit() {
    switch (this.endpoint) {
      case "patient":
        this.patientSubscription = this.requestSvc.patientParamsState$.subscribe(params => {
          this.params = params;
        })
        break;

      case "sample":
        this.sampleSubscription = this.requestSvc.sampleParamsState$.subscribe(params => {
          this.params = params;
        })
        break;
    }
  }

  ngOnChanges() {
    if (this.countries && this.countries.length > 0) {
      this.addMissing();
      this.updateCountrySelections(this.params)
    }
  }

  ngOnDestroy() {
    this.patientSubscription.unsubscribe();
    this.sampleSubscription.unsubscribe();
  }

  updateCountrySelections(params, fieldName = "country.identifier") {
    if (params) {
      let filtered = params.filter(d => d.field === fieldName);

      let selectedCountries = flatMapDeep(filtered, (d: any) => d.value);

      this.countries.forEach((d: any) => {
        d['disabled'] = !selectedCountries.includes(d.term);
      })
    } else {
      // initial conditions: off
      this.countries.forEach((d: any) => {
        d['disabled'] = true;
      })
    }
  }

  selectCountry(ctry: string) {
    let idx = this.countries.findIndex(d => d.term === ctry);
    this.countries[idx].disabled = !this.countries[idx].disabled;

    let countries = this.countries.filter(d => !d.disabled).map(d => d.term);

    this.requestSvc.updateParams(this.endpoint, { field: 'country.identifier', value: countries })
  }

  addMissing() {
    let keys = this.countries.map(d => d.term);
    if (this.all_countries) {
      let missing_data = this.all_countries.filter(d => !keys.includes(d.term));

      missing_data.forEach(d => {
        this.countries.push({ term: d.term, count: 0, disabled: true });
      })
    }
  }

}
