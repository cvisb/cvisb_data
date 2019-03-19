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
  sampleSearchParams: RequestParamArray;

  // Event listener for parameters to run on
  public patientParamsSubject: BehaviorSubject<RequestParamArray> = new BehaviorSubject<RequestParamArray>([]);
  public patientParamsState$ = this.patientParamsSubject.asObservable();

  public sampleParamsSubject: BehaviorSubject<RequestParamArray> = new BehaviorSubject<RequestParamArray>([]);
  public sampleParamsState$ = this.sampleParamsSubject.asObservable();

  constructor(
  ) {
    // subscribe to current parameters
    this.patientParamsState$.subscribe((params: RequestParamArray) => {
      // console.log("API params")
      // console.log(params)
      this.patientSearchParams = params;
    })


    this.sampleParamsState$.subscribe((params: RequestParamArray) => {
      // console.log("API params")
      // console.log(params)
      this.sampleSearchParams = params;
    })

  }

  // --- Communal function to add in missing data to the data ---
  // Merge in null values: update the data to add in missing values.
  // Assumes values are contained in a 'key' variable
  // Essential for object constancy on transitions/updates.
  addMissing(data, domain: any[]) {
    let keys = data.map(d => d.term);

    let missing_data = domain.filter(d => !keys.includes(d));

    missing_data.forEach(d => {
      data.push({ term: d, count: 0 });
    })
    return (data);
  }

  // --- Communal update search parameters function ---
  updateParams(endpoint: string, newParam: RequestParam) {
    // console.log(newParam)
    // if key already exists, replace the data.
    // otherwise push to the array of endpoints
    switch (endpoint) {
      case 'patient': {
        let params = this.checkExists(this.patientSearchParams, newParam);
        // console.log(params)

        this.patientParamsSubject.next(params);
        break;
      }
      case 'sample': {
        let params = this.checkExists(this.sampleSearchParams, newParam);
        // console.log(params)

        this.sampleParamsSubject.next(params);
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
    // console.log(newParam)
    let idx = currentParams.map(d => d.field).indexOf(newParam.field);

    // console.log(currentParams)
    // console.log(idx)

    // --- CASE 1: Parameter already exists.  UPDATE ---
    if (idx > -1) {
      // replace the parameter with the new one.
      // If it's being turned off-- `excluded === True` --- remove the value from the array
      // If null or empty array, delete the parameter.
      if (newParam.value && newParam.value.length > 0) {
        if (newParam.exclude) {
          let valueIdx = currentParams[idx].value.indexOf(newParam.value);
          if (valueIdx !== -1) {
            currentParams[idx].value.splice(valueIdx, 1);
          } else {
            // https://dev.cvisb.org/api/patient/query?q=(cohort:Lassa)%20OR%20(NOT%20cohort:Lassa)
          };
        } else if (Array.isArray(newParam.value)) {
          // For things like new patient IDs, replace the entire sheband with the new value, since it comes in as an array.
          currentParams[idx].value = newParam.value;
        } else {
          if (Array.isArray(currentParams[idx].value)) {
            // If it's an array, push.  Otherwise replace.
            currentParams[idx].value.push(newParam.value);
          } else {
            currentParams[idx].value = newParam.value;
          }
        }

        // Update the OR selector.
        if (newParam.orSelector) {
          currentParams[idx].orSelector = newParam.orSelector;
        } else {
          currentParams[idx].orSelector = null;
        }
      } else {
        currentParams.splice(idx, 1);
      }

      // --- CASE 2: Parameter doesn't exists.  APPEND ---
    } else {
      if (newParam.value) {
        // if value isn't an array, turn it into one.
        if (!Array.isArray(newParam.value)) {
          newParam.value = [newParam.value];
        }
        currentParams.push(newParam)
      }
    }
    return (currentParams)
  }

  // Example for searching both patientID and altID:
  // https://dev.cvisb.org/api/patient/query?q=__all__&size=10&patientID="G-0001","C-8743183"
  // Requires a q string to execute-- patientID acts as a filter on top of the original query.
  reduceParams(request_params: RequestParamArray): string {
    let param_string: string;
    let params: string[] = [];

    // Separate out the patientID portion of the params... if they exist.
    let patientIdx = request_params.findIndex(d => d.field === "patientID");
    let patient_string: string;
    if (patientIdx > -1) {
      let patient_params = request_params.splice(patientIdx, 1);
      patient_string = this.patientParams2String(patient_params[0]);
    } else {
      patient_string = "";
    }


    if (request_params && request_params.length > 0) {

      // Collapse each parameter down into a parameter string
      for (let param of request_params) {
        if (!param.field) {
          // generic search query; no variable-level searching
          params.push(param.value);
        } else {
          // convert the parameter object into a string and add to array.
          let new_param = this.params2String(param);

          // console.log(new_param)

          // Check if there's an OR parameter to relate to that property.
          if (param.orSelector) {
            let or_param = this.params2String(param.orSelector);
            new_param = `${new_param} OR ${or_param}`
            // console.log(or_param)
            // console.log(new_param)

          }
          params.push(new_param);
        }
      }

      param_string = params.join(" AND ");
    } else {
      param_string = "__all__"
    }

    console.log(param_string + patient_string)
    return (param_string + patient_string);
  }

  // Function to reduce the patientID query.
  patientParams2String(param: RequestParam) {
    return (` & patientID=\"${param.value.join('","')}\"`);
  }

  params2String(param: RequestParam) {

    if (Array.isArray(param.value)) {
      if (param.value.length === 1 && /\[.+\]/.test(param.value[0])) {
        // array containing a range query; don't encapuslate in quote marks.
        return (`${param.field}:${param.value[0]}`);
      } else if (param.value.length === 1 && param.field.includes("\_exists\_")) {
        // If the parameter is all null / all not null, encapsulate in parens
        return (`\(${param.field}:${param.value[0]}\)`)
      }
      return ((`${param.field}:\(\"${param.value.join('" "')}\"\)`));
    } else if (param.field.includes("\_exists\_")) {
      // If the parameter is all null / all not null, encapsulate in parens
      return (`\(${param.field}:${param.value}\)`)
    } else if (/\[.+\]/.test(param.value)) {
      // range query; don't encapuslate in quote marks.
      return (`${param.field}:${param.value}`);
    } else {
      return ((`${param.field}:\(\"${param.value}\"\)`));
    }
  }

  // Opposite direction: convert query_string into an array.
  splitQuery(query_string: string): RequestParamArray {
    // split into individual params by ` AND `
    let query_array = query_string.replace(/%20/g, " ").split(" AND ");
    // console.log(query_array)

    // for each couplet:
    // 1. split into orSelectors
    // 2. split into field/values
    // 3. remove `()`, `""`
    // 4. split values into array.
    let paramArray: RequestParamArray = [];
    for (let query of query_array) {
      paramArray.push(this.splitParamString(query))
    }
    // console.log(paramArray)
    return (paramArray);
  }


  splitParamString(param_string: string): RequestParam {
    // split into OR statements.
    let str_array = param_string.replace(/%20/g, " ").split(" OR ");
    // console.log(str_array)

    if (str_array.length === 1) {
      // console.log(this.splitPieces(str_array[0]))
      return (this.splitPieces(str_array[0]));
    } else {
      let arr = this.splitPieces(str_array[0]);
      let or_arr = this.splitPieces(str_array[1]);
      arr['orSelector'] = or_arr
      // console.log(arr)
      return (arr);
    }
  }

  splitPieces(param_string: string): RequestParam {
    // split into field / values
    let vals = param_string.split(":");
    // console.log(vals)
    let variable = vals[0];
    let values;

    if (/\[.+\]/.test(vals[1])) {
      // range query; leave it alone.
      values = vals[1];
    } else if (variable.includes("\_exists\_")) {
      variable = variable.replace(/\(/g, "").replace(/\)/g, "");
      values = vals[1].replace(/\(/g, "").replace(/\)/g, "");

    }
    else {
      // remove `""` and `()`
      // split values by space `%20` into array
      values = vals[1].replace(/\"/g, "").replace(/%22/g, "").replace(/%20/g, " ").replace(/\(/g, "").replace(/\)/g, "").split(/\s/)
    }
    // console.log(values)

    return ({ field: variable, value: values });
  }

}
