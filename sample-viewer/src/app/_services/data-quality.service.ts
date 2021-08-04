import { Injectable } from '@angular/core';

import { forkJoin, Observable } from 'rxjs';
import { map, tap, pluck, mergeMap } from 'rxjs/operators';

import { HttpParams, HttpClient, HttpHeaders } from '@angular/common/http';
import { MyHttpClient } from './http-cookies.service';
import { ESFacetTerms } from '../_models';
import { cloneDeep } from 'lodash';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class DataQualityService {
  facetVar: string = "cohort.keyword";
  variablesExist: Object[] = [
    { group: "provenance", variables: ['dateModified', 'dataStatus', 'sourceFiles', 'citation'] },
    {
      group: "demographics", variables: [
        'patientID', 'species', 'occupation', 'ethnicity', 'age', 'height', 'weight', 'pregnant',
      ]
    },
    { group: "time", variables: ['admitDate', 'evalDate', 'presentationWeek', 'infectionDate', 'infectionYear', 'dischargeDate', 'daysOnset', 'daysInHospital',] },
    { group: "geography", variables: ['country', 'admin2', 'admin3'] },
    { group: "survivor-only", variables: ['sID', 'hasSurvivorData', 'contactGroupIdentifier', 'survivorEnrollmentDate', 'survivorEvalDates', 'relatedTo', 'exposureType', 'contactSurvivorRelationship'] },
    { group: "acute-only", variables: ['gID', 'hasPatientData', 'admittedLassaWard', 'LassaExposed', 'LassaHHDeaths'] },
  ];

  variablesUnknown: string[] = ['gender', 'outcome', 'cohort'];
  experimentVariables: string[] = ['elisa-ag'];
  essentialVariables: string[] = ['elisa-ag'];

  constructor(private http: MyHttpClient) { }

  getMissing(): Observable<any> {
    return this.getTotal().pipe(
      mergeMap(totals =>
        forkJoin(this.getExistsGroup(totals), this.getUnknownsGroup()).pipe(
          map(results => results.flatMap(d => d).flatMap(d => d))
        )
      )
    )
  }

  getTotal(): Observable<ESFacetTerms[]> {
    return this.http.get(`${environment.api_url}/api/patient/query`, {
      observe: 'response',
      params: new HttpParams()
        .set('q', `__all__`)
        .set('facets', this.facetVar)
        .set('facet_size', "100")
        .set('size', "0")
    }).pipe(
      pluck('body', 'facets', this.facetVar, 'terms')
    )
  }

  getUnknowns(varName: string): Observable<any> {
    let facetString = `${this.facetVar}(${varName}.keyword)`;

    return this.http.get(`${environment.api_url}/api/patient/query`, {
      observe: 'response',
      params: new HttpParams()
        .set('q', `__all__`)
        .set('facets', facetString)
        .set('facet_size', "100")
        .set('size', "0")
    }).pipe(
      pluck('body', 'facets', this.facetVar, 'terms'),
      map((results: ESFacetTerms[]) => {
        let arr = [];
        results.forEach(d => {
          let result = {};
          result['term'] = d['term'];
          let unknowns = d[`${varName}.keyword`]['terms'].filter((d: any) => d.term.toLowerCase() == "unknown");
          let unknownCount = unknowns.length > 0 ? unknowns[0].count : 0;
          result['count'] = d[`${varName}.keyword`]['total'] - unknownCount;
          result['percent'] = 1 - (result['count'] / d['count']);
          result['variable'] = varName;
          result['total'] = d['count'];
          arr.push(result);
        })

        return (arr)
      })
    )
  }


  getUnknownsGroup(): Observable<any> {
    return forkJoin(... this.variablesUnknown.map(d => this.getUnknowns(d)))
  }

  getExistsGroup(totals: ESFacetTerms[]): Observable<any> {
    return forkJoin(... this.variablesExist.flatMap(d => d['variables']).map(d => this.getExists(d, totals)))
  }

  getExists(varName: string, totals: ESFacetTerms[]): Observable<any> {
    return this.http.get(`${environment.api_url}/api/patient/query`, {
      observe: 'response',
      params: new HttpParams()
        .set('q', `_exists_:${varName}`)
        .set('facets', this.facetVar)
        .set('facet_size', "100")
        .set('size', "0")
    }).pipe(
      pluck('body', 'facets', this.facetVar, 'terms'),
      map((results: any[]) => {
        if (results.length > 0) {
          totals.forEach(total => {
            let idx = results.findIndex(count => total.term === count.term);
            if (idx > -1) {
              results[idx]['percent'] = 1 - (results[idx].count / total.count);
              results[idx]['variable'] = varName;
              results[idx]['total'] = total.count;
            } else {
              results.push({count: 0, percent: 1, variable: varName, term: total.term, total: total.count})
            }
          })
        } else {
          results = cloneDeep(totals);
          results.forEach(d => {
            d['total'] = d.count;
            d['count'] = 0;
            d['percent'] = 1;
            d['variable'] = varName;
          })
        }
        return (results);
      })
    )
  }
}
