import { Injectable } from '@angular/core';

import { HttpParams } from '@angular/common/http';

import { ApiService } from './api.service';
import { ReleaseNote } from '../_models';

@Injectable({
  providedIn: 'root'
})

export class GetDatacatalogService {
  dataModified: string;
  dataCatalog: Object[];
  cvisbCatalog: Object;
  releaseNotes: ReleaseNote[];

  constructor(private apiSvc: ApiService) {

    this.apiSvc.getPaginated("datacatalog", new HttpParams().set("q", "__all__")).subscribe(res => {
      this.dataCatalog = res['hits'];
      this.cvisbCatalog = this.dataCatalog.filter(d => d['identifier'] === "https://data.cvisb.org/")[0];
      this.dataModified = this.cvisbCatalog['dateModified'];

      this.releaseNotes = this.cvisbCatalog['releaseNotes'];

      if (this.releaseNotes) {
        this.releaseNotes.sort((a, b) => a.version > b.version ? -1 : 1);
      }
    })



  }
}
