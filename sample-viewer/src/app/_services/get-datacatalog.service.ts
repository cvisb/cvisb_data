import { Injectable } from '@angular/core';

import { HttpParams } from '@angular/common/http';
import { Observable, pipe, BehaviorSubject } from 'rxjs';
import { map, tap, pluck } from 'rxjs/operators';

import { ApiService } from './api.service';
import { ReleaseNote, DataCatalog } from '../_models';

@Injectable({
  providedIn: 'root'
})

export class GetDatacatalogService {
  public dataCatalogSubject = new BehaviorSubject<DataCatalog>(null);
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

  getDatasets() {
    let params = new HttpParams()
    .set("q", "__all__")
    .set("size", "0")
    .set("facets", "identifier.keyword")
    .set("facet_size", "1000");

    return this.apiSvc.get("dataset", params).pipe(
      pluck("facets", "identifier.keyword", "terms"),
      map((datasets: any) => {
        return(datasets.map(d => d.term))
      })

    )
  }
}
