import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map, catchError, mergeMap, tap, flatMap, finalize } from "rxjs/operators";
import { Observable, Subject, BehaviorSubject, throwError, forkJoin, of, from } from 'rxjs';

import { ActivatedRoute } from '@angular/router';

import * as d3 from 'd3';
import { flattenDeep } from 'lodash';

import { environment } from "../../environments/environment";
import { Sample, SampleWide, AuthState, RequestParamArray, Patient, ESFacetTerms } from '../_models/';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';
import { MyHttpClient } from './http-cookies.service';
import { RequestParametersService } from './request-parameters.service';

@Injectable({
  providedIn: 'root'
})

export class GetSamplesService {
  request_params: RequestParamArray;
  excludeEmptySamples: boolean;

  // Event listeners to pass data.
  private samples_wide: SampleWide[] = [];
  public samplesSubject: BehaviorSubject<Object[]> = new BehaviorSubject<Object[]>(null);
  public samplesWideSubject: BehaviorSubject<Object[]> = new BehaviorSubject<Object[]>([]);
  public samplesState$ = this.samplesSubject.asObservable();
  public samplesWideState$ = this.samplesWideSubject.asObservable();

  public sampleSummarySubject: BehaviorSubject<Object> = new BehaviorSubject<Object>({ patients: null, cohort: null, outcome: null });
  public sampleSummaryState$ = this.sampleSummarySubject.asObservable();

  public loadingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public loadingState$ = this.loadingSubject.asObservable();

  samplePatientMD: Patient[] = [];
  private numSampleTypes: number = 5;


  constructor(
    public myhttp: MyHttpClient,
    private requestSvc: RequestParametersService,
    private route: ActivatedRoute,
    private apiSvc: ApiService,
    private authSvc: AuthService) {

    // Listener for changes in auth status
    // this.authSvc.authState$.subscribe((authState: AuthState) => {
    //   if (authState.authorized) {
    //     console.log("change in auth status")
    //     this.getSamples();
    //   }
    // })

    // Listener for changes in query params
    this.requestSvc.sampleParamsState$.subscribe((params: RequestParamArray) => {
      // console.log("Re-getting samples with new parameters:")
      // console.log(params)
      this.request_params = params;

      let empties = params.filter(d => d.field === "location.numAliquots");
      this.excludeEmptySamples = (empties.length > 0 && empties[0].value[0] === "[1 TO *]") ? true : false;

      console.log(this.excludeEmptySamples)
      // this.getSamples(params);
    })
  }

  // Main function to get the samples + associated patient-level metadata
  getSamples(qParamArray: RequestParamArray, sortVar, sortDirection, pageIdx, pageSize): Observable<any> {
    console.log('calling get samples')
    if (this.samplePatientMD.length === 0) {
      // samplePatientMD stores the patient metadata (cohort, outcome, etc.)
      // for ALL samples currently in the database at load time.
      // It's (ideally) called once and then stored for the rest of the session,
      // since it shouldn't change unless new sample data is uploaded.

      this.loadingSubject.next(true);

      // (1) Call /patient to grab all the patient info for the patients for whom we have samples
      // NOTE: needs to be moved to a resolver? When have URL states...
      return this.getSamplePatientData()
        // (2) Call /sample to get the subset of samples indicated by the qParams
        // Merge to patient metadata properties
        .pipe(flatMap(samplePatientMD => this.getNPrepSamples(qParamArray, sortVar, sortDirection, pageIdx, pageSize)),
          finalize(() => this.loadingSubject.next(false))
        );
    } else {
      // Patient-Sample metadata already exists.
      // Execute the /sample query to get the filtered samples.
      return this.getNPrepSamples(qParamArray, sortVar, sortDirection, pageIdx, pageSize).pipe(
        finalize(() => this.loadingSubject.next(false))
      );
    }
  }


  // Main function to execute the call to /sample to get a list of samples and merge to patient props
  getNPrepSamples(filterParamArray: RequestParamArray, sortVar, sortDirection, pageIdx, pageSize) {
    if (!sortVar) {
      // Check for if mat sort hasn't been initialized.
      sortVar = "";
    }
    // ES syntax for sorting is `sort=variable:asc` or `sort=variable:desc`
    // BUT-- Biothings changes the syntax to be `sort=+variable` or `sort=-variable`. + is optional for asc sorts
    let sortString: string = sortDirection === "desc" ? `-${this.apiSvc.sortFunc(sortVar)}` : this.apiSvc.sortFunc(sortVar);

    console.log("Calling prep samples")
    let params = this.requestSvc.reduceSampleParams(filterParamArray);
    params = params
      .append("sort", sortString)
      .append('size', '1000');
    // .append('size', pageSize.toString())
    // .append('from', (pageSize * pageIdx).toString())

    console.log('sample params:')
    console.log(params)

    return this.myhttp.get<any[]>(`${environment.api_url}/api/sample/query`, {
      observe: 'response',
      headers: new HttpHeaders()
        .set('Accept', 'application/json'),
      params: params
    }).pipe(
      map(data => {
        let samples = data['body']['hits'];
        console.log(data)
        if (samples) {

          samples.forEach(d => {
            // Merge in the patient properties associated with that sample
            let filtered = this.samplePatientMD.filter(patient => patient.alternateIdentifier.includes(d.privatePatientID));

            // filter out used up samples
            // has to be done AFTER the fact, since
            if (this.excludeEmptySamples) {
              d.location = d.location.filter(d => d.numAliquots > 0);
            }

            if (filtered.length === 1) {
              d['patientID'] = filtered[0].patientID;
              d['alternateIdentifier'] = filtered[0].alternateIdentifier;
              d['cohort'] = filtered[0].cohort;
              d['species'] = filtered[0].species;
              d['gender'] = filtered[0].gender;
              d['outcome'] = filtered[0].outcome;
              d['country'] = filtered[0].country['identifier'];
              d['infectionYear'] = filtered[0].infectionYear;
              d['dateModified_patient'] = filtered[0].dateModified;
              // d['elisa'] = filtered[0].elisa;
            }
          })
          console.log("merge complete.")

          this.samplesSubject.next(samples);

          this.sampleSummarySubject.next(this.getSampleSummary(samples));
          console.log('samples long')
          console.log(samples)

          // Grab the sample locations and data and reshape to display in the table.
          this.nestSamples(samples);
          this.samplesWideSubject.next(this.samples_wide);
          return ({ samples: samples, sampleWide: this.samples_wide })
        } else {
          console.log('Error in getting samples')
          this.samplesSubject.next(samples);
          console.log(data)
        }
      }),
      catchError(e => {
        return of(e);
      })
    )
  }

  // TODO: Scroll to deal w/ > 1000 patients
  getSamplePatientData(qParams?): Observable<any> {
    // NOTE: will fail for results > 1000
    // https://dev.cvisb.org/api/patient/query?q=__all__&sampleQuery=*&facets=alternateIdentifier.keyword(cohort.keyword)&facet_size=1000&size=0
    // If unspecified, set q string to return all.
    qParams = qParams ? qParams : new HttpParams().set("q", "__all__");

    let params = qParams
      .append('size', 1000)
      .append("sampleQuery", (`_exists_:privatePatientID`));

    return this.myhttp.get<any[]>(`${environment.api_url}/api/patient/query`, {
      observe: 'response',
      headers: new HttpHeaders()
        .set('Accept', 'application/json'),
      params: params
    }).pipe(
      map(res => {
        console.log(res);
        this.samplePatientMD = res["body"]["hits"];
        return (res["body"]["hits"])
      }),
      catchError(e => {
        return of(e);
      })
    );
  }


  getSample(id: string) {
    this.myhttp.get<any[]>(environment.api_url + "/api/sample/" + id, {
      // this.myhttp.get<any[]>(environment.host_url + "/api/sample/test_2", {
      observe: 'response',
      headers: new HttpHeaders()
        .set('Accept', 'application/json')
    }).subscribe(data => {
      console.log(data)
    },
      err => {
        console.log(err)
      })
  }


  // Using ES facetting on patient properties isn't possible, since it is a cross-endpoint query
  // Although the query executes properly, it counts number of unique PATIENTS, not number of unique SAMPLES
  // So... since they're already merged to the samples anyway, we'll count 'em up.
  getSampleSummary(samples): Object {
    let summary = {};

    summary['outcome'] = this.countBy(samples, "outcome", "unknown");
    summary['cohort'] = this.countBy(samples, "cohort", "Unknown");
    summary['years'] = this.countBy(samples, "infectionYear", "Unknown");
    summary['country'] = this.countBy(samples, "country", "unknown");

    // Make sure to remove nulls-- ngSelect can't have nulls as options
    // Should also remove duplicates, since there are multiple samples / patient
    summary['patients'] = flattenDeep(samples.map((d: any) => d.alternateIdentifier)).filter(d => d).sort((a, b) => a < b ? -1 : 1);
    summary['patients'] = Array.from(new Set(summary['patients']));

    console.log(summary)

    return (summary)
  }


  /*
  Internal function to return an ESFacetTerms object countaining {term: <blah>, count: <number>}
   */
  countBy(objArr: Object[], groupBy: string, undefinedLabel = "Unknown"): ESFacetTerms {
    let result = objArr.map(d => d[groupBy]).reduce(function(acc, curr) {
      // compress undefined --> unknown
      if (!curr) {
        curr = undefinedLabel;
      }

      let idx = acc.findIndex(d => d.term === curr);

      if (idx == -1) {
        acc.push({ term: curr, count: 1 })
      } else {
        acc[idx]['count'] += 1;
      }

      return acc;
    }, []);

    return (result);
  }


  nestSamples(samples) {
    // Internal update function: either creates an array of unique values, or a single value.
    let _updateSet = function(prev, curr, variable) {
      let return_val;
      if (prev[variable]) {
        return_val = prev[variable];
        if (prev[variable] !== curr[variable] && !prev[variable].includes(curr[variable])) {

          Array.isArray(return_val) ? null :
            return_val = [return_val];
          return_val.push(curr[variable]);
        }
      } else {
        return_val = curr[variable];
      }
      return (return_val)
    }

    // Converts the long table into a wide one, with patientID, privatePatientID, and visitCode pulled out to the highest level
    // Each sample type is an array containing the sample locations + associated metadata.
    this.samples_wide = d3.nest()
      .key((d: any) => d.privatePatientID + String(d.visitCode))
      // 	.key(d => d.sampleType)
      .rollup(function(d: any) { // do this to each grouping
        // reduce takes a list and returns one value
        // in this case, the list is all the grouped elements
        // and the final value is an object with keys
        return d.reduce(function(prev, curr) {
          // If it already exists-- append
          // If not-- create it as an array/set (for unique values)
          prev["patientID"] = _updateSet(prev, curr, "patientID");
          prev["alternateIdentifier"] = _updateSet(prev, curr, "alternateIdentifier");
          prev["cohort"] = _updateSet(prev, curr, "cohort");
          prev["outcome"] = _updateSet(prev, curr, "outcome");
          prev["privatePatientID"] = _updateSet(prev, curr, "privatePatientID");
          prev["visitCode"] = _updateSet(prev, curr, "visitCode");

          prev[curr["sampleType"]] ? prev[curr["sampleType"]].push(curr) : prev[curr["sampleType"]] = [curr];
          return prev;
        }, {});
      })
      .entries(samples)
      .map((d) => d.value);

    console.log(this.samples_wide)
  }

}
