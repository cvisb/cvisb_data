// Resolver is used to make sure the call to getDataset completes *before* Angular Universal finishes rendering the Dataset
// Necessary so Google Dataset search sees the dataset metadata being embedded in the page source as it crawls.

import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';

import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

import { getDatasetsService } from './get-datasets.service';

@Injectable()
export class DatasetResolver implements Resolve<any> {
  constructor(private datasetSvc: getDatasetsService,
    @Inject(PLATFORM_ID) private platformId: Object) { }

  resolve(route: ActivatedRouteSnapshot) {
    if (isPlatformServer(this.platformId)) {
      console.log('server')
      let dsid = route.data.dsid;
      return this.datasetSvc.getDataset(dsid);
    } else {
      console.log('client')
    }
  }
}
