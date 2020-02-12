import { Injectable } from '@angular/core';

import { HttpParams } from '@angular/common/http';
import { Observable, pipe, BehaviorSubject } from 'rxjs';
import { map, tap, pluck } from 'rxjs/operators';

import { ApiService } from './api.service';
import { ReleaseNote } from '../_models';

@Injectable({
  providedIn: 'root'
})

export class GetDatacatalogService {
  public dataCatalogSubject = new BehaviorSubject<Object>(null);
  public dataCatalog$ = this.dataCatalogSubject.asObservable();

  constructor(private apiSvc: ApiService) {
    this.getDataCatalog().subscribe(catalogue => this.dataCatalogSubject.next(catalogue));
  }

  getDataCatalog() {
    return this.apiSvc.getPaginated("datacatalog", new HttpParams().set("q", "__all__")).pipe(
      pluck('hits'),
      map(catalogues => {
        let cvisbCatalog = catalogues[0];
        cvisbCatalog['releaseNotes'].sort((a, b) => a.version > b.version ? -1 : 1);
        return cvisbCatalog;
      })
    )
  }
}
