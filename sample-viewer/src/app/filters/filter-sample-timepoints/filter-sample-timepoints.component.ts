import { Component, OnInit, Input } from '@angular/core';

import { FilterTimepointsService } from '../../_services';

@Component({
  selector: 'app-filter-sample-timepoints',
  templateUrl: './filter-sample-timepoints.component.html',
  styleUrls: ['./filter-sample-timepoints.component.scss']
})

export class FilterSampleTimepointsComponent implements OnInit {
  @Input() endpoint: string;
  data;
  freqDomain: number[];
  filter_title: string = "Sample Timepoints";


  // temp1.facets["privatePatientID.keyword"].terms.forEach(d => d["numTimepoints"] = d["visitCode.keyword"].terms.length)

  constructor(private filterSvc: FilterTimepointsService) {
  }

  ngOnInit() {
    this.filterSvc.summarizeTimepoints().subscribe(res => {
      console.log(res)
      this.data = res;
      this.freqDomain = [Math.min(... res.map(d => d.term)), Math.max(... res.map(d => d.term))];
    });
  }

}
