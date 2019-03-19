// based on https://blog.angular-university.io/angular-material-data-table/
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Injectable } from "@angular/core";
import { map } from 'rxjs/operators';

import { Observable } from "rxjs";

import { Patient } from '../_models';

import { GetPatientsService } from './get-patients.service';

@Injectable()
export class AllPatientsResolver implements Resolve<Patient[]> {

    constructor(private patientSvc: GetPatientsService) {

    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):  Observable<any[]> {
        return this.patientSvc.getAllPatientsSummary();
    }

}
