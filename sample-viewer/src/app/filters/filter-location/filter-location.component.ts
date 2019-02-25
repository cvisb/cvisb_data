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
  }

  selectCountry(ctry: string) {
    this.requestSvc.updateParams(this.endpoint, { field: 'country.identifier', value: ctry })
  }

  addMissing() {
    console.log(this.all_countries)
    console.log(this.countries)

    let keys = this.countries.map(d => d.key);
    console.log(keys)

    let missing_data = this.all_countries.filter(d => !keys.includes(d.key));
    console.log(missing_data)


    missing_data.forEach(d => {
      this.countries.push({ key: d.key, name: d.name, value: 0 });
    })
    console.log(this.countries)
  }

}
