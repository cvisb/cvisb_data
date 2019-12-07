// based on https://blog.angular-university.io/angular-material-data-table/
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Injectable } from "@angular/core";

import { HttpParams } from '@angular/common/http';

import { Observable, forkJoin, pipe } from "rxjs";
import { map, tap } from "rxjs/operators";

import { NewPatientSummary } from '../_models';

import { GetPatientsService } from './get-patients.service';

@Injectable()
export class PatientsResolver implements Resolve<NewPatientSummary> {

  constructor(private patientSvc: GetPatientsService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<NewPatientSummary> {
    let route_params = route.queryParams;

    let all_params = new HttpParams().set("q", "__all__");

    if(route_params.q) {
      console.log("different parameters selected!  calling the selected filtered patients + all the patients")
      return forkJoin([this.patientSvc.getPatientSummary(all_params), this.patientSvc.getPatientSummary(route_params.q)]).pipe(
        map(([allSummary, selectedSummary]) => {
          return({allPatientSummary: allSummary, selectedPatientSummary: selectedSummary})
        }),
        tap(x => console.log(x))
      );
    } else {
      console.log("nothing selected!  calling the patient summary 1x.")
      return this.patientSvc.getPatientSummary(route_params.q).pipe(
        map(patientSummary => {
          return({allPatientSummary: patientSummary, selectedPatientSummary: patientSummary})
        }),
        tap(x => console.log(x))
      );
    }

  }

}
