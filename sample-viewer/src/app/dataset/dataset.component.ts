import { Component, OnInit, HostListener, ViewChild, Input } from '@angular/core';

import { MatPaginator, MatSort } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { getDatasetsService, AuthService } from '../_services';

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
    private fileSvc: getDatasetsService,
    private titleSvc: Title,
    private route: ActivatedRoute,
    private authSvc: AuthService
  ) {
    // set page title
    this.titleSvc.setTitle(this.route.snapshot.data.title);

    fileSvc.getDatasets().subscribe((datasets) => {
      this.datasets = datasets;
      // console.log(this.datasets);
    });


  }

  ngOnInit() {
  }

}
