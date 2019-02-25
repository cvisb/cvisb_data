import { Component, OnInit, Input } from '@angular/core';

import { RequestParametersService } from '../../_services';
import { RequestParam } from '../../_models';

@Component({
  selector: 'app-filter-location',
  templateUrl: './filter-location.component.html',
  styleUrls: ['./filter-location.component.scss']
})

export class FilterLocationComponent implements OnInit {
  @Input() countries;
  @Input() all_countries;
  @Input() endpoint: string;

  constructor(private requestSvc: RequestParametersService) {
  }

  ngOnInit() {
    this.addMissing();
  }

  selectCountry(ctry: string) {
    this.requestSvc.updateParams(this.endpoint, { field: 'country.identifier', value: ctry })
  }

  addMissing() {
    let keys = this.countries.map(d => d.key);

    let missing_data = this.all_countries.filter(d => !keys.includes(d.key));

    missing_data.forEach(d => {
      this.countries.push({ key: d.key, name: d.name, value: 0 });
    })
  }

}
