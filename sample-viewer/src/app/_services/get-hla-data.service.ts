import { Injectable } from '@angular/core';

import { nest } from 'd3';
import * as d3 from 'd3';
import { countBy, flatMapDeep } from 'lodash';
import { HLA, D3Nested, HLAnested, HLAsummary, CohortSelectOptions } from '../_models';

import { HttpParams } from '@angular/common/http';
import { Observable, Subject, BehaviorSubject, throwError } from 'rxjs';
import { map, catchError, mergeMap, finalize } from "rxjs/operators";

import { ApiService } from './api.service';
import { ESResult } from '../_models';


@Injectable({
  providedIn: 'root'
})
export class GetHlaDataService {
  patientTypes: D3Nested[];
  patientOutcomes: D3Nested[];
  patientCount: number;
  HLA_DATA = [];
  // alleleCount: D3Nested[];
  // novelAlleles: D3Nested[];

  public alleleCountSubject: BehaviorSubject<D3Nested[]> = new BehaviorSubject<D3Nested[]>([]);
  public alleleCountState$ = this.alleleCountSubject.asObservable();

  public novelAllelesSubject: BehaviorSubject<D3Nested[]> = new BehaviorSubject<D3Nested[]>([]);
  public novelAllelesState$ = this.novelAllelesSubject.asObservable();

  public patientTypeSubject: BehaviorSubject<D3Nested[]> = new BehaviorSubject<D3Nested[]>([]);
  public patientTypeState$ = this.patientTypeSubject.asObservable();

  public patientOutcomeSubject: BehaviorSubject<D3Nested[]> = new BehaviorSubject<D3Nested[]>([]);
  public patientOutcomeState$ = this.patientOutcomeSubject.asObservable();

  public patientCountSubject: BehaviorSubject<number> = new BehaviorSubject<number>(null);
  public patientCountState$ = this.patientCountSubject.asObservable();

  // Loading spinner
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loadingState$ = this.loadingSubject.asObservable();


  constructor(private apiSvc: ApiService) {
    this.summarizeHLA().subscribe(_ => {
    });;
  }

  getHLAdata(patientID?: string): Observable<Object> {
    let params = new HttpParams()
      .set("q", 'includedInDataset.keyword: hla')
      .set("fields", "data, publisher, dateModified");

    if (patientID) {
      params = params.append("patientID", `"${patientID}"`);
    }

    // TODO: change to fetchAll
    return this.apiSvc.get("experiment", params, 1000).pipe(
      map((res: any) => {
        // collapse the data down to a single long array of each allele
        // make sure to remove any expts which lack a data object
        let data = flatMapDeep(res['hits'], d => d.data).filter(d => d);
        let publisher = flatMapDeep(res['hits'], d => d.publisher).filter(d => d);
        let dateModified = res['hits'].map(d => d.dateModified).join();

        return ({ data: data, publisher: publisher, dateModified: dateModified })
      }
      ))
  }

  getLRFiltered(leftOptions, rightOptions): Observable<Object[]> {
    this.loadingSubject.next(true);

    return this.getFilteredHLA(leftOptions).pipe(
      mergeMap(leftResults => this.getFilteredHLA(rightOptions).pipe(
        map(rightResults => {
          return ({ left: leftResults, right: rightResults });
        }),
        catchError(e => {
          console.log(e)
          throwError(e);
          return (new Observable<any>())
        }),
        finalize(() => this.loadingSubject.next(false))
      )
      )
    )
  }

  getFilteredHLA(patientOptions): Observable<Object[]> {
    let pQuery = `cohort:${patientOptions.cohort.join(",")} AND outcome:${patientOptions.outcome.join(",")}`;

    let params = new HttpParams()
      .set("q", 'includedInDataset.keyword:hla')
      .set("fields", "data")
      .set("patientQuery", pQuery);


    // TODO: change to fetchAll
    return this.apiSvc.fetchAll("experiment", params).pipe(
      map((res) => {
        let data = flatMapDeep(res, d => d.data).filter(d => d);;
        return (this.getComparisonCounts(data))
      }
      ))
  }

  // getpatientHLA(patientID): Observable<Object[]> {
  //   let params = new HttpParams()
  //     .set("q", 'measurementTechnique:"HLA sequencing"')
  //     .set("patientID", `"${patientID}"`)
  //     .set("fields", "data");
  //
  //   // TODO: change to fetchAll
  //   return this.apiSvc.get("experiment", params, 1000).pipe(
  //     map((res: ESResponse) => {
  //       console.log(res);
  //
  //       // collapse the data down to a single long array of each allele
  //       // make sure to remove any expts which lack a data object
  //       let data = res['hits'].flatMap(d => d.data).filter(d => d);
  //       console.log(data)
  //
  //       return (data)
  //     }
  //     ))
  // }

  summarizeHLA() {
    // ex. summarization call:
    // https://dev.cvisb.org/api/patient/query?q=__all__&experimentQuery=measurementTechnique:"HLA%20sequencing"&size=0&facets=cohort.keyword,%20outcome.keyword&facet_size=10000
    let patientParams = new HttpParams()
      .set("q", "__all__")
      .set("experimentQuery", 'includedInDataset.keyword:hla')
      .set("facets", "cohort.keyword, outcome.keyword")
      .set("facet_size", "10000");

    return this.getHLAdata().pipe(
      mergeMap(hla_data => this.apiSvc.get("patient", patientParams, 0)
        .pipe(
          map((patientData: any) => {
            this.patientCountSubject.next(patientData['total']);

            let patientOutcomes = patientData['facets']['outcome.keyword']['terms'];

            this.patientOutcomeSubject.next(patientOutcomes);


            let patientTypes = patientData['facets']['cohort.keyword']['terms']

            this.patientTypeSubject.next(patientTypes);

            // --- unique alleles ---
            this.getAlleleCounts(hla_data['data']);

            // --- unique alleles ---
            this.getUniqueCounts(hla_data['data']);
          })
        )))
  }

  getAlleleCounts(hla_data) {
    let alleleCount = nest()
      .key((d: HLA) => d.locus)
      .key((d: HLA) => d.allele)
      .rollup(function(values: any): any {
        return {
          total: values.length,
          novel: values.map((patient: HLA) => patient.novel).every((d: any) => d)
        }
      })
      .entries(hla_data);

    alleleCount.forEach((d: D3Nested) => { d.count = d.values.length });

    this.alleleCountSubject.next(alleleCount);

    return (alleleCount);
  }

  getComparisonCounts(data: HLA[]): HLAnested[] {
    // nest data
    let nested_hla = d3.nest()
      .key((d: HLA) => d.locus)
      .key((d: HLA) => d.allele)
      .rollup((values: any) => values.length)
      .entries(data);

    nested_hla.forEach((element: HLAnested) => {
      // calculate total per locus.
      element.total = d3.sum(element.values.map((d: HLAsummary) => d.value))

      let locus_total = element.total;

      // calc allelic frequency
      element.values.forEach(locus_allele => {
        locus_allele.pct = locus_allele.value / locus_total;
      })
    })

    return (nested_hla);
  }

  getUniqueCounts(hla_data) {
    let novelAlleles = nest()
      .key((d: HLA) => d.locus)
      .rollup(function(values: any): any {
        return {
          total: values.length,
          data: values,
          alleles: values.map((patient: HLA) => patient.allele),
          unique_alleles: d3.map(values, (patient: HLA) => patient.allele).keys(),
          unique_summary: countBy(values, 'allele'),
          unique_total: d3.map(values, (patient: HLA) => patient.allele).keys().length
        }
      })
      .entries(hla_data.filter((d: HLA) => d.novel === true));

    novelAlleles.forEach((d: any) =>
      d.count = d.value.unique_total
    )

    this.novelAllelesSubject.next(novelAlleles);
    return (novelAlleles);
  }

}
