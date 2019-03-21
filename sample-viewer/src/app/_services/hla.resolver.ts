// Resolver is used to make sure the call to HLA summary data initializes *before* Angular Universal finishes rendering the Dataset
// Necessary so Google Dataset search sees the dataset metadata being embedded in the page source as it crawls.

import { Injectable } from '@angular/core';

import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

import { Observable, of } from 'rxjs';

import { GetHlaDataService } from './get-hla-data.service';

@Injectable()
export class HlaResolver implements Resolve<any> {
  constructor(private hlaSvc: GetHlaDataService) { }

  resolve(route: ActivatedRouteSnapshot) {
    return this.hlaSvc.summarizeHLA();
  }
}
