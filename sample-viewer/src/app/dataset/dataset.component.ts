import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { HttpParams } from '@angular/common/http';
import { Observable, Subject, BehaviorSubject, throwError } from 'rxjs';
import { map, catchError, mergeMap } from "rxjs/operators";

import { getDatasetsService, ApiService } from '../_services';

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
    private apiSvc: ApiService,
    private titleSvc: Title,
    private route: ActivatedRoute
  ) {
    // set page title
    this.titleSvc.setTitle(this.route.snapshot.data.title);

    let exptParams = new HttpParams()

    this.datasetSvc.getDatasets()
      .pipe(
        mergeMap((datasets: any) => this.apiSvc.get("experiment", new HttpParams().set("q", `measurementTechnique:"viral%20sequencing",%20"HLA%20sequencing"`).set("facets", "measurementTechnique.keyword"), 0).pipe(
          map(expts => {

            datasets.forEach(dataset => {
              dataset["expt_count"] = expts['facets']["measurementTechnique.keyword"]["terms"].filter(d => d.term === dataset.measurementTechnique)
            })

            this.datasets = datasets;

            console.log(expts)
            console.log(this.datasets)
          }),
          catchError(e => {
            console.log(e)
            throwError(e);
            return (new Observable<any>())
          })
        )
        ))
  }

  ngOnInit() {
  }

}
