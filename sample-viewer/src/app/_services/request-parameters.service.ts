// Generic functions for all endpoints to update parameters for a given search.

import { Injectable } from '@angular/core';

import { HttpParams } from '@angular/common/http';


import { Observable, Subject, BehaviorSubject, throwError } from 'rxjs';

// services
// import { GetPatientsService } from './get-patients.service';
import { cloneDeep } from 'lodash';

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

  private patientProperties: string[] = ["alternateIdentifier", "patientID", "cohort", "outcome", "infectionYear", "country.identifier", "gID", "sID", "elisa"];
  private sampleProperites: string[] = ["sampleType", "location.lab", "species"];

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
    console.log('newParam')
    console.log(newParam)
    // if key already exists, replace the data.
    // otherwise push to the array of endpoints
    switch (endpoint) {
      case 'patient': {
        let params = this.checkExists(this.patientSearchParams, newParam);
        // console.log(params)
        // this.reduceParams(params);

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
          // For things like new patient IDs, replace the entire shebang with the new value, since it comes in as an array.
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

  reduceSampleParams(request_params: RequestParamArray): HttpParams {
    let reduced = this.reduceParams(request_params);

    // default options
    // Note: * will only return those samples who are in the patient registry.  "" will return everything
    let patient_string: string = reduced.patient_string ? reduced.patient_string : "";
    let sample_string: string = reduced.sample_string ? reduced.sample_string : "__all__";

    let http_params = new HttpParams()
      .set('q', sample_string)
      // .set('sampleQuery', sample_string)
      // .set('experimentQuery', experiment_string)
      .set('patientQuery', patient_string);

    return (http_params);
  }

  reducePatientParams(request_params): HttpParams {
    // default options
    let reduced = this.reduceParams(request_params);

    let patient_string: string = reduced.patient_string ? reduced.patient_string : "__all__"; // Note: * will only return those samples who are in the patient registry.  "" will return everything
    let sample_string: string = reduced.sample_string ? reduced.sample_string : "";


    let http_params = new HttpParams()
      .set('q', patient_string)
      .set('sampleQuery', sample_string)
    // .set('experimentQuery', experiment_string)
    // .set('patientQuery', patient_string);

    return (http_params);
  }

  reduceParams(request_params: RequestParamArray) {
    let patient_string: string;
    let sample_string: string;

    if (request_params) {
      let patientParams = request_params
        .filter(d => this.patientProperties
          .includes(d.field)).map(param => this.reduceHandler(param));

      patient_string = patientParams.length > 0 ? patientParams.join(" AND ") : "";
      // console.log(patient_string)

      let sampleParams = request_params
        .filter(d => this.sampleProperites
          .includes(d.field)).map(param => this.reduceHandler(param));

      sample_string = sampleParams.length > 0 ? sampleParams.join(" AND ") : "__all__";
    }
    return ({ patient_string: patient_string, sample_string: sample_string })
  }

  // Example for searching both patientID and altID:
  // https://dev.cvisb.org/api/patient/query?q=__all__&size=10&patientID="G-0001","C-8743183"
  // Ex: ELISA filter: https://dev.cvisb.org/api/patient/query?q=elisa.virus.keyword:Ebola%20AND%20elisa.ELISAresult:positive&size=10
  // Requires a q string to execute-- patientID acts as a filter on top of the original query.
  // reduceParams(request_params: RequestParamArray): HttpParams {
  //   let param_string: string;
  //   let patient_string: string = "";
  //   let params: string[] = [];
  //
  //   let request_copy = cloneDeep(request_params);
  //
  //   if (request_copy && request_copy.length > 0) {
  //     // Collapse each parameter down into a parameter string
  //     for (let param of request_copy) {
  //
  //       switch (param.field) {
  //         // Separate out the patientID portion of the params... if they exist.
  //         case 'patientID':
  //           patient_string = this.patientIDHandler(param);
  //           break;
  //         case 'elisa':
  //           params = this.elisaHandler(param, params);
  //           break;
  //         default:
  //           params = this.defaultHandler(param, params);
  //       }
  //
  //     }

  //   // If there's jsut a patientID string, replace qString with __all__
  //   param_string = params.length > 0 ? params.join(" AND ") : "__all__";
  // } else {
  //   param_string = "__all__"
  // }

  //   console.log(param_string + patient_string)
  //   let http_params = new HttpParams()
  //     .set('q', param_string)
  //     .set('patientID', patient_string);
  //
  //   return (http_params);
  // }

  // Function to reduce the patientID query.
  patientIDHandler(param: RequestParam) {
    // Must be ampersand, not AND, to append to q string
    return (`\"${param.value.join('","')}\"`);
  }

  elisaHandler(param, params) {
    let elisa_vals = param.value[0];
    // Verify that the three required properties -- virus, assay, and result -- all are there before combining (?)
    if (elisa_vals.virus.length > 0 && elisa_vals.assay.length > 0 && elisa_vals.result.length > 0) {
      let elisaparams;

      for (let virus of elisa_vals.virus) {
        let pairs = [];
        pairs.push({ field: "elisa.virus", value: virus });
        for (let assay of elisa_vals.assay) {
          pairs.push({ field: "elisa.assayType", value: assay });

          // for(let timepoint of param.timepoint){
          for (let result of elisa_vals.result) {
            pairs.push({ field: "elisa.ELISAresult", value: result });

            elisaparams = {
              pairs: pairs,
              connector: "AND"
            };
            // elisaparams.push(
            //   {
            //     pairs:
            //       [{
            //         pairs: pairs,
            //         connector: "AND"
            //       }],
            //     connector: "OR"
            //   }
            // )
          }
        }
      }
      console.log(this.connectKeyValues(elisaparams))


      params.push(this.connectKeyValues(elisaparams));
    }
    return (params)
  }

  reduceKeyValues(obj): string {
    return (`${obj.field}:${obj.value}`);
  }

  connectKeyValues(obj): string {
    console.log(obj)
    let pairs = obj.pairs.map(pair => this.reduceKeyValues(pair));

    return (`(${pairs.join(` ${obj.connector} `)})`);
  }

  // params = this.handleELISAResultsLoop(param, params, 'Ebola');
  // params = this.handleELISAResultsLoop(param, params, 'Lassa');
  //
  // return (params)


  // handleELISAResultsLoop(param, params, virus, varName = "elisa") {
  //   let virus_obj = param.value[0][virus];
  //
  //   let virus_keys = Object.keys(virus_obj);
  //
  //   // Compress each result into a virus:result:assay triple
  //   let virus_strings = virus_keys.map(d => {
  //     return (this.handleELISAResult(virus_obj, d, virus, varName));
  //   })
  //   console.log(virus_strings)
  //
  //   // Join results by OR
  //   // Filter out the null results
  //   let elisa_result = `${virus_strings.filter(d => d).join(" OR ")}`;
  //   if (elisa_result) {
  //     params.push(`(${elisa_result})`);
  //   }
  //
  //   console.log(params);
  //   return (params)
  // }
  //
  // handleELISAResult(obj, key, virus, varName = "elisa"): string {
  //   let result_string: string;
  //   let val = obj[key];
  //
  //   // For those true values-- the ones that are checked-- compress down to a string
  //   if (val) {
  //     let [assay, result] = key.split("_");
  //     result_string = `${varName}.virus:${virus}`;
  //     result_string = `${result_string} AND ${varName}.assayType:${assay}`;
  //     result_string = result === "unknown" ? `${result_string} AND -_exists_: ${varName}.ELISAresult` : `${result_string} AND ${varName}.ELISAresult:${result}`;
  //
  //   }
  //   // console.log(result_string)
  //   if (result_string) {
  //     return (`(${result_string})`);
  //   } else {
  //     return;
  //   }
  // }


  defaultHandler(param, params) {
    if (!param.field) {
      // generic search query; no variable-level searching
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

    return (params);
  }

  reduceHandler(param) {
    if (!param.field) {
      // generic search query; no variable-level searching
      return (param.value);
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
      return (new_param);
    }
  }

  params2String(param: RequestParam) {

    if (Array.isArray(param.value)) {
      if (param.value.length === 1 && /\[.+\]/.test(param.value[0])) {
        // array containing a range query; don't encapuslate in quote marks.
        return (`${param.field}:${param.value[0]}`);
      } else if (param.value.length === 1 && param.value.includes("\_exists\_")) {
        // If the parameter is all null / all not null, encapsulate in parens
        return (`\(${param.value[0]}:${param.field}\)`)
      }
      return ((`${param.field}:\(\"${param.value.join('" "')}\"\)`));
    } else if (param.value.includes("\_exists\_")) {
      // If the parameter is all null / all not null, encapsulate in parens
      return (`\(${param.value}:${param.field}\)`)
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
    // switching & into AND to split
    let query_array = query_string.replace(/q%3D/g, "").replace(/q%3D/g, "").replace(/%20/g, " ").replace(/&/g, "AND").replace(/%26/g, "AND").split(" AND ");
    console.log(query_array)

    // for each couplet:
    // 1. split into orSelectors
    // 2. split into field/values
    // 3. remove `()`, `""`
    // 4. split values into array.
    let paramArray: RequestParamArray = [];
    for (let query of query_array) {
      console.log(query)
      paramArray.push(this.splitParamString(query))
    }
    // console.log(paramArray)
    return (paramArray);
  }


  splitParamString(param_string: string): RequestParam {
    console.log(param_string)
    // split into OR statements.
    let str_array = param_string.replace(/%20/g, " ").split(" OR ");
    console.log(str_array)

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
    // for patientID=id1,id2 -- replace = by : to convert into format of others
    param_string = param_string.replace("=", ":")
    // split into field / values
    let vals = param_string.split(":");
    console.log(vals)
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
