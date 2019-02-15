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
    console.log(newParam)
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
    console.log(newParam)
    let idx = currentParams.map(d => d.field).indexOf(newParam.field);
    if (idx > -1) {
      // replace the parameter with the new one
      // If null, delete the parameter.
      newParam.value ? currentParams[idx].value = newParam.value : currentParams.splice(idx, 1);
    } else {
      if (newParam.value) {
        currentParams.push(newParam)
      }
    }
    return (currentParams)
  }

  reduceParams(request_params: RequestParamArray): string {
    let param_string: string;
    let params: string[] = [];
    if (request_params && request_params.length > 0) {

      // Collapse each parameter down into a parameter string
      for (let param of request_params) {
        if (!param.field) {
          // generic search query; no
          params.push(param.value);
        } else {
          // convert the parameter object into a string and add to array.
          let new_param = this.params2String(param);

          console.log(new_param)

          // Check if there's an OR parameter to relate to that property.
          if (param.orSelector) {
            let or_param = this.params2String(param.orSelector);
            new_param = `${new_param} OR ${or_param}`
            console.log(or_param)
            console.log(new_param)

          }
          params.push(new_param);
        }
      }

      param_string = params.join(" AND ");
    } else {
      param_string = "__all__"
    }

    console.log(param_string)
    return (param_string)
  }

  params2String(param: RequestParam) {
    if (Array.isArray(param.value)) {
      return ((`${param.field}:\(\"${param.value.join('" "')}\"\)`));
    } else {
      return ((`${param.field}:\(\"${param.value}\"\)`));
    }
  }
}
