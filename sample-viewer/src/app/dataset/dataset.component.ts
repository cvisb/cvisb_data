import { Component, OnInit, HostListener, ViewChild, Input } from '@angular/core';

import { MatPaginator, MatSort } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { GetFilesService, AuthService } from '../_services';

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
    private fileSvc: GetFilesService,
    private titleSvc: Title,
    private route: ActivatedRoute,
    private authSvc: AuthService
  ) {
    // set page title
    this.titleSvc.setTitle(this.route.snapshot.data.title);

    this.datasets = fileSvc.getFiles();
    console.log(this.datasets);

  }

  ngOnInit() {
  }

}
