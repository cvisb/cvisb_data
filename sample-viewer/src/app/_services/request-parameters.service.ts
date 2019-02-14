// Generic functions for all endpoints to update parameters for a given search.

import { Injectable } from '@angular/core';

import { Observable, Subject, BehaviorSubject, throwError } from 'rxjs';

// services
// import { GetPatientsService } from './get-patients.service';

// models
import { RequestParamArray, RequestParam } from '../_models';

@Injectable({
  providedIn: 'root'
})

export class RequestParametersService {
  patientSearchParams: RequestParamArray;

  // Event listener for parameters to run on
  public patientParamsSubject: BehaviorSubject<RequestParamArray> = new BehaviorSubject<RequestParamArray>([]);
  public patientParamsState$ = this.patientParamsSubject.asObservable();

  constructor(
  ) {

    // subscribe to current parameters
    this.patientParamsSubject.subscribe((params: RequestParamArray) => {
      console.log("API params")
      console.log(params)
      this.patientSearchParams = params;
    })

  }

  // --- Communal update search parameters function ---
  updateParams(endpoint: string, newParam: RequestParam) {
    // if key already exists, replace the data.
    // otherwise push to the array of endpoints
    switch (endpoint) {
      case 'patient': {
        let params = this.checkExists(this.patientSearchParams, newParam);
        console.log(params)

        this.patientParamsSubject.next(params);
        break;
      }
      case 'dataset': {
        console.log('sending dataset endpoint  ' + newParam.field + ": " + newParam.value);
        break;
      }
      default: {
        console.log("ERROR! Unknown endpoint to be filtered: " + endpoint)
        break;
      }
    }
  }

  checkExists(currentParams: RequestParamArray, newParam: RequestParam): RequestParamArray {
    let idx = currentParams.map(d => d.field).indexOf(newParam.field);
    if(idx > -1) {
      // replace the parameter with the new one
      currentParams[idx].value = newParam.value;
    } else {
      currentParams.push(newParam)
    }
    return(currentParams)
  }
}
