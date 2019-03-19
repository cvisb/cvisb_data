// based on https://blog.angular-university.io/angular-material-data-table/
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Injectable } from "@angular/core";
import { map } from 'rxjs/operators';

import { HttpParams } from '@angular/common/http';

import { Observable } from "rxjs";

import { Patient } from '../_models';

import { GetPatientsService } from './get-patients.service';

@Injectable()
export class PatientsResolver implements Resolve<Patient[]> {

  constructor(private patientSvc: GetPatientsService) {

  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any[]> {
    let qparams = route.queryParams;
    let qstring = qparams.q ? qparams.q : new HttpParams().set("q", "__all__");
    // console.log("resolving with qparams = " + qstring);
    return this.patientSvc.getPatientSummary(qstring);
  }

}
