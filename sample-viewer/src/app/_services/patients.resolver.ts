// based on https://blog.angular-university.io/angular-material-data-table/
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Injectable } from "@angular/core";

import { HttpParams } from '@angular/common/http';

import { Observable, forkJoin, pipe, EMPTY } from "rxjs";
import { map, tap } from "rxjs/operators";

import { ResolverPatientSummary, PatientSummary } from '../_models';

import { GetPatientsService } from './get-patients.service';

@Injectable()
export class PatientsResolver implements Resolve<PatientSummary | null> {

  constructor(private patientSvc: GetPatientsService) {
  }

  // resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<PatientSummary | null> {
    let route_params = route.queryParams;

    if (route_params.q) {
      return this.patientSvc.getAllPatientsSummary();
    } else {
      return(EMPTY)
    }
      // .pipe(
    //     map(patientSummary => {
    //       return ({ allPatientSummary: patientSummary, selectedPatientSummary: patientSummary })
    //     })
    //   );
    // }
    //
    // if (route_params.q) {
    //   console.log("different parameters selected!  calling the selected filtered patients + all the patients")
    //   return forkJoin([this.patientSvc.getAllPatientsSummary(), this.patientSvc.getPatientSummary(route_params.q)]).pipe(
    //     map(([allSummary, selectedSummary]) => {
    //       return ({ allPatientSummary: allSummary, selectedPatientSummary: selectedSummary })
    //     }),
    //     tap(x => console.log(x))
    //   );
    // } else {
      // return this.patientSvc.getAllPatientsSummary();
      // .pipe(
    //     map(patientSummary => {
    //       return ({ allPatientSummary: patientSummary, selectedPatientSummary: patientSummary })
    //     })
    //   );
    // }

  }

}
