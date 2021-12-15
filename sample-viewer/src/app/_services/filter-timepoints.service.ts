import { Injectable } from '@angular/core';

import { HttpHeaders, HttpParams } from '@angular/common/http';
import { map } from "rxjs/operators";
import { Observable } from 'rxjs';
import { MyHttpClient } from './http-cookies.service';

import { environment } from "../../environments/environment";

import _ from 'lodash';

import { ESFacetTerms, PatientTimepoints } from '../_models';


@Injectable({
  providedIn: 'root'
})

export class FilterTimepointsService {

  constructor(
    public myhttp: MyHttpClient,
  ) {
  }

  // Call to https://dev.cvisb.org/api/sample/query?q=__all__&facets=privatePatientID.keyword(visitCode.keyword)&facet_size=10000&size=0
  // Groups by privatePatientID, then counts the number of visitCodes.
  // Before returning, collapses the ESNestedFacet result into a tuple of privatePatientID and numTimepoints (length of unique number of visitCode terms.)
  getTimepoints(qString: string): Observable<PatientTimepoints[]> {
    let params = new HttpParams()
      .set('q', '__all__')
      .append('facets', 'privatePatientID.keyword(visitCode.keyword)')
      .append('size', '0')
      .append('facet_size', '10000');

    return this.myhttp.get<any[]>(`${environment.api_url}/api/sample/query`, {
      observe: 'response',
      headers: new HttpHeaders()
        .set('Accept', 'application/json'),
      params: params
    }).pipe(
      map(res => {
        let patient_timepoints = res['body']['facets']["privatePatientID.keyword"].terms.map(d => {
          return ({
            "privatePatientID": d.term, "numTimepoints": d['visitCode.keyword']['terms'].length
          })
        });

        // console.log(patient_timepoints);

        return (patient_timepoints);
      }
      )
    );
  }

  summarizeTimepoints() {
    return this.getTimepoints("__all__").pipe(
      map((res: PatientTimepoints[]) => {
        let summary = _(res)
          .groupBy('numTimepoints')
          .map((items, id) => {
            return {
              term: +id,
              count: items.length
            };
          }).value();

        return (summary);
      })
    )
  }

  // Returns an array of patientIDs to use in a subsequent filter.
  filterTimepoints(lowerLimit: number, upperLimit: number) {
    return this.getTimepoints("__all__").pipe(
      map((res: PatientTimepoints[]) => {
        let filteredPatients = res
          .filter(d => d.numTimepoints <= upperLimit && d.numTimepoints >= lowerLimit)
          .map(d => d.privatePatientID);

        return (filteredPatients);
      })
    )
  }
}
