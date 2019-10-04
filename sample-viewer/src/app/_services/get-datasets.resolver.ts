// Resolver is used to make sure the call to getDataset completes *before* Angular Universal finishes rendering the Dataset
// Necessary so Google Dataset search sees the dataset metadata being embedded in the page source as it crawls.
import { Injectable } from '@angular/core';
import { of } from "rxjs";
import { tap } from "rxjs/operators";

import { TransferState, makeStateKey } from '@angular/platform-browser';

import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

import { getDatasetsService } from './get-datasets.service';

const DATASET_KEY = makeStateKey('dataset_resolver.result');

@Injectable()
export class DatasetResolver implements Resolve<any> {
  private result;

  constructor(private datasetSvc: getDatasetsService,
    private readonly transferState: TransferState) { }

  // From https://blog.angularindepth.com/using-transferstate-api-in-an-angular-5-universal-app-130f3ada9e5b
  resolve(route: ActivatedRouteSnapshot) {
    const found = this.transferState.hasKey(DATASET_KEY);
    console.log(found)

    if (found) {
      const res = of(this.transferState.get(DATASET_KEY, null));
      this.transferState.remove(DATASET_KEY);
      return res;
    } else {
      this.transferState.onSerialize(DATASET_KEY, () => this.result);
      let dsid = route.data.dsid;
      // Send result --> this.result, which saves it to transferState
      return this.datasetSvc.getDataset(dsid).pipe(
        tap(result => this.result = result)
      );
    }
  }
}
