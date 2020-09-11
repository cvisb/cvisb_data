import { Component, OnInit } from '@angular/core';

import { ApiService } from '../_services/api.service';

import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-summary-stats',
  templateUrl: './summary-stats.component.html',
  styleUrls: ['./summary-stats.component.scss']
})

export class SummaryStatsComponent implements OnInit {
  displayedColumns: string[];
  dataSource;

  constructor(private apiSvc: ApiService) {
  }

  ngOnInit() {



  }

  countPatientsWithSamples(var1, var2?) {
    let variableString = var2 ? `var1(var2)` : `var1`;

    let params = new HttpParams()
      .set("facet_size", "10000")
      .set("facets", variableString)
      .set("sampleQuery", "_exists_:privatePatientID");

    this.apiSvc.get("patient", params, 0).subscribe(results => {
      let counts = results['facets'];
      this.dataSource = counts;

    })
  }
}
