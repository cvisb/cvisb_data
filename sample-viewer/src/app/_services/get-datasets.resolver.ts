// Resolver is used to make sure the call to getDataset completes *before* Angular Universal finishes rendering the Dataset
// Necessary so Google Dataset search sees the dataset metadata being embedded in the page source as it crawls.

import { Injectable } from '@angular/core';

import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { getDatasetsService } from './get-datasets.service';

@Injectable()
export class DatasetResolver implements Resolve<any> {
  constructor(private datasetSvc: getDatasetsService) { }

  resolve(route: ActivatedRouteSnapshot) {
    let dsid = route.paramMap.get('dsid') ? route.paramMap.get('dsid') : route.url[1].path;
    // return this.datasetSvc.getDataset(route.paramMap.get('dsid'));
    return this.datasetSvc.getDataset(dsid)
      .pipe(map(ds => {
        console.log("dataset in activated route")
        console.log(ds)
        return (ds)
      }));
  }
}
