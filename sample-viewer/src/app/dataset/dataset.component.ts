import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { getDatasetsService } from '../_services';

@Component({
  selector: 'app-dataset',
  templateUrl: './dataset.component.html',
  styleUrls: ['./dataset.component.scss']
})

export class DatasetComponent implements OnInit {
  datasets: any[];
  metadata: Object;
  anything_selected: boolean = false;


  constructor(
    private datasetSvc: getDatasetsService,
    private titleSvc: Title,
    private route: ActivatedRoute
  ) {
    // set page title
    this.titleSvc.setTitle(this.route.snapshot.data.title);

    this.datasetSvc.getDatasets().subscribe((datasets) => {
      this.datasets = datasets;
      console.log(this.datasets);
    });


  }

  ngOnInit() {
  }

}
