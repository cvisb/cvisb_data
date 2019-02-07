import { Injectable } from '@angular/core';

import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

import { Observable, of } from 'rxjs';

import { getDatasetsService } from './get-datasets.service';

@Injectable()
export class DatasetResolver implements Resolve<any> {
  constructor(private datasetSvc: getDatasetsService) {}

  resolve(route: ActivatedRouteSnapshot) {
    console.log(route)
    return this.datasetSvc.getDataset(route.paramMap.get('dsid'));
  }
}
