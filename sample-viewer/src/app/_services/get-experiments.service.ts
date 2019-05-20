import { Injectable } from '@angular/core';

import { HttpParams } from '@angular/common/http';

import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class GetExperimentsService {

  constructor(private apiSvc: ApiService) { }

  getExpt(patientID: string, measurementTechnique: string) {
    let qString = `measurementTechnique:"${measurementTechnique}"`;

    let params = new HttpParams()
      .set('q', qString)
      .set('patientID', patientID);
      console.log(params)

    return (this.apiSvc.get('experiment', params));
  }
}
