// Resolver is used to make sure the call to getDataset completes *before* Angular Universal finishes rendering the Dataset
// Necessary so Google Dataset search sees the dataset metadata being embedded in the page source as it crawls.
import { Injectable } from '@angular/core';
import { of } from "rxjs";
import { tap } from "rxjs/operators";

// import { TransferState, makeStateKey } from '@angular/platform-browser';

import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

import { getDatasetsService } from './get-datasets.service';

// const DATASET_KEY = makeStateKey('dataset_resolver.result');

@Injectable()
export class DatasetResolver implements Resolve<any> {
  // private result;

  constructor(private datasetSvc: getDatasetsService,
    // private readonly transferState: TransferState
  ) { }

  // Needed to fix endless fetchAll loop in SSR when multiple fetchAlls are called... scroll_id gets reused when it shouldn't
  // From https://blog.angularindepth.com/using-transferstate-api-in-an-angular-5-universal-app-130f3ada9e5b
  // NOTE: could also set the conditions to be if(server): call API; if(client): get state.
  // BUT... this means that if you navigate between pages, the server-side wouldn't have necessarily been called,
  // and no transferState exists.  So need to check if it exists, then call either server- (reload) or client- (navigate) side
  //
  // NOTE 2: the state ISN'T stored upon navigation change. This is inefficient; dataset results aren't cached,
  // even though they shouldn't change.
  // This is because `this.transferState.remove(DATASET_KEY);` removes saving the state.
  // Since `get-datasets.resolver` is recycled and re-used between different datasets, need to clear it, so you don't have viral seq data saved when you call the HLA page.
  // Could create separate resolvers for each dataset type and cache the results...
  resolve(route: ActivatedRouteSnapshot) {
    let dsid = route.data.dsid ? route.data.dsid : route.params.dsid;
    // Send result --> this.result, which saves it to transferState
    return this.datasetSvc.getDataset(dsid);

    // const found = this.transferState.hasKey(DATASET_KEY);
    //
    // if (found) {
    //   const res = of(this.transferState.get(DATASET_KEY, null));
    //   this.transferState.remove(DATASET_KEY);
    //   return res;
    // } else {
    //   this.transferState.onSerialize(DATASET_KEY, () => this.result);
    //   let dsid = route.data.dsid;
    //   // Send result --> this.result, which saves it to transferState
    //   return this.datasetSvc.getDataset(dsid).pipe(
    //     tap(result => this.result = result)
    //   );
    // }
  }
}
