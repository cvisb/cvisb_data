import { Component, OnInit } from '@angular/core';

import { FilterTimepointsService } from '../../_services';

@Component({
  selector: 'app-filter-sample-timepoints',
  templateUrl: './filter-sample-timepoints.component.html',
  styleUrls: ['./filter-sample-timepoints.component.scss']
})

export class FilterSampleTimepointsComponent implements OnInit {

  data;


  // temp1.facets["privatePatientID.keyword"].terms.forEach(d => d["numTimepoints"] = d["visitCode.keyword"].terms.length)

  constructor(private filterSvc: FilterTimepointsService) {
  }

  ngOnInit() {
    this.filterSvc.summarizeTimepoints().subscribe(res => {
      this.data = res;
    });

    console.log(this.data)

    this.filterSvc.filterTimepoints(2,3);

  }

}
