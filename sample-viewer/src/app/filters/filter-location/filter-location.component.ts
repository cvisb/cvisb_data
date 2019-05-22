import { Component, OnChanges, Input } from '@angular/core';

import { RequestParametersService } from '../../_services';
import { RequestParam } from '../../_models';

@Component({
  selector: 'app-filter-location',
  templateUrl: './filter-location.component.html',
  styleUrls: ['./filter-location.component.scss']
})

export class FilterLocationComponent implements OnChanges {
  @Input() countries;
  @Input() all_countries;
  @Input() endpoint: string;

  constructor(private requestSvc: RequestParametersService) {
  }

  ngOnChanges() {
    this.addMissing();
    console.log(this.countries);
  }

  selectCountry(ctry: string) {
    this.requestSvc.updateParams(this.endpoint, { field: 'country.identifier', value: ctry })
  }

  addMissing() {
    let keys = this.countries.map(d => d.term);


    // console.log(this.all_countries)
    if (this.all_countries) {
      let missing_data = this.all_countries.filter(d => !keys.includes(d.term));

      missing_data.forEach(d => {
        this.countries.push({ key: d.term, name: d.name, value: 0 });
      })
    }
  }

}
