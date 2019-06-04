// based on https://blog.angular-university.io/angular-material-data-table/
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Injectable } from "@angular/core";
import { map } from 'rxjs/operators';

import { HttpParams } from '@angular/common/http';

import { Observable } from "rxjs";

import { Patient } from '../_models';

import { GetSamplesService } from './get-samples.service';

@Injectable()
export class SamplesResolver implements Resolve<Patient[]> {

  constructor(private sampleSvc: GetSamplesService) {

  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Patient[]> {
    let qparams = route.queryParams;
    let qstring = qparams.q ? qparams.q : new HttpParams().set("q", "__all__");
    return this.sampleSvc.getSamplePatientData(qstring);
  }

}
