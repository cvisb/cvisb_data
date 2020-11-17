import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { getDatasetsService, AuthService } from '../_services';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dataset',
  templateUrl: './dataset.component.html',
  styleUrls: ['./dataset.component.scss']
})

export class DatasetComponent implements OnInit {
  datasets$: Observable<Object[]>;
  // datasets: any[];
  metadata: Object;
  anything_selected: boolean = false;


  constructor(
    private datasetSvc: getDatasetsService,
    private titleSvc: Title,
    private route: ActivatedRoute,
    private authSvc: AuthService
  ) {
    // set page title
    this.titleSvc.setTitle(this.route.snapshot.data.title);

    this.datasets$ = this.datasetSvc.getDatasets();
    // this.datasetSvc.getDatasets().subscribe((datasets) => {
    //   console.log(datasets)
    // });

    // Show terms, if they haven't been displayed before:
    this.authSvc.popupTerms();
  }

  public scroll(element: any) {
    element.scrollIntoView({ behavior: 'smooth' });
  }

  ngOnInit() {
  }

}
