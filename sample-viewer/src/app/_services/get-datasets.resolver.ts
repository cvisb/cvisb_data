// Resolver is used to make sure the call to getDataset completes *before* Angular Universal finishes rendering the Dataset
// Necessary so Google Dataset search sees the dataset metadata being embedded in the page source as it crawls.

import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { Observable, of } from "rxjs";

import { TransferState, makeStateKey } from '@angular/platform-browser';

const DATASET_KEY = makeStateKey('dataset_resolver.result');

import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

import { getDatasetsService } from './get-datasets.service';

@Injectable()
export class DatasetResolver implements Resolve<any> {
  private result;

  constructor(private datasetSvc: getDatasetsService,
    private readonly transferState: TransferState,
    @Inject(PLATFORM_ID) private platformId: Object) { }

  // From https://blog.angularindepth.com/using-transferstate-api-in-an-angular-5-universal-app-130f3ada9e5b
  resolve(route: ActivatedRouteSnapshot) {
    //   if (isPlatformServer(this.platformId)) {
    //     console.log('server')
    //     let dsid = route.data.dsid;
    //     return this.datasetSvc.getDataset(dsid);
    //   } else {
    //     console.log('client')
    //   }
    // }

    const found = this.transferState.hasKey(DATASET_KEY);
    if (found) {
      const res = of(this.transferState.get(DATASET_KEY, null));
      console.log('transfer state exists')
      console.log(res)
      this.transferState.remove(DATASET_KEY);
      return res;
    } else {
      this.transferState.onSerialize(DATASET_KEY, () => this.result);
      let dsid = route.data.dsid;
      return this.datasetSvc.getDataset(dsid);
    }
  }
}
