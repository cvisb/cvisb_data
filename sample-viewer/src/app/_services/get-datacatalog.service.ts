import { Injectable } from '@angular/core';

import { HttpParams } from '@angular/common/http';

import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})

export class GetDatacatalogService {
  dataModified: string;
  dataCatalog: Object[];
  cvisbCatalog: Object;

  constructor(private apiSvc: ApiService) {

    apiSvc.getPaginated("datacatalog", new HttpParams().set("q", "__all__")).subscribe(res => {
      console.log('getting catalog')
      console.log(res)
      this.dataCatalog = res['hits'];
      this.cvisbCatalog = this.dataCatalog.filter(d => d['identifier'] === "https://data.cvisb.org/")[0];
      this.dataModified = this.cvisbCatalog['dateModified'];
    })

  }
}
