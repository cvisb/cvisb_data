// based on https://blog.angular-university.io/angular-material-data-table/
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Injectable } from "@angular/core";

import { Observable } from "rxjs";

import { PatientSummary } from '../_models';

import { GetPatientsService } from './get-patients.service';

@Injectable()
export class AllPatientsResolver implements Resolve<PatientSummary> {

    constructor(private patientSvc: GetPatientsService) {

    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):  Observable<PatientSummary> {
        return this.patientSvc.getAllPatientsSummary();
    }

}
