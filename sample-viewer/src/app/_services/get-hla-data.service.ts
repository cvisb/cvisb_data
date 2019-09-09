import { Injectable } from '@angular/core';

import { nest } from 'd3';
import * as d3 from 'd3';
import * as _ from 'lodash';
import { HLA, D3Nested } from '../_models';

import { HttpParams } from '@angular/common/http';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { map, catchError, mergeMap } from "rxjs/operators";

import { ApiService } from './api.service';
import { ESResponse } from '../_models';


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


  constructor(private apiSvc: ApiService) {
    this.summarizeHLA();
  }

  getHLAdata() {
    let params = new HttpParams()
      .set("q", 'measurementTechnique:"HLA sequencing"')
      .set("fields", "data")

    // TODO: change to fetchAll
    return this.apiSvc.get("experiment", params, 1000)
  }

  getpatientHLA(patientID): Observable<Object[]> {
    let params = new HttpParams()
      .set("q", 'measurementTechnique:"HLA sequencing"')
      .set("patientID", `"${patientID}"`)
      .set("fields", "data");

    // TODO: change to fetchAll
    return this.apiSvc.get("experiment", params, 1000).pipe(
      map((res: ESResponse) => {
        console.log(res);

        // collapse the data down to a single long array of each allele
        // make sure to remove any expts which lack a data object
        let data = res['hits'].flatMap(d => d.data).filter(d => d);
        console.log(data)

        return (data)
      }
      ))
  }


  summarizeHLA() {
    // TODO: figure better way?  Lodash only takes the first (?) value for the data, so doesn't check if there are unique ID/cohort combos.  Which should be okay, but not ideal.
    let unique_IDs = _.uniqBy(this.HLA_DATA, d => d.patientID)

    this.patientCountSubject.next(unique_IDs.length);

    let patientOutcomes = nest()
      .key((d: HLA) => d.outcome)
      .rollup((values: any) => values.length)
      .entries(unique_IDs);

    // Align w/ ES syntax
    patientOutcomes.forEach(d => {
      d['term'] = d.key;
      d['count'] = d.value;

    })

    this.patientOutcomeSubject.next(patientOutcomes);


    // _.countBy(unique_IDs, 'outcome');
    let patientTypes = nest()
      .key((d: HLA) => d.cohort)
      .rollup((values: any) => values.length)
      .entries(unique_IDs);

    // Align w/ ES syntax
    patientTypes.forEach(d => {
      d['term'] = d.key;
      d['count'] = d.value;

    })

    this.patientTypeSubject.next(patientTypes);

    // --- unique alleles ---
    this.getAlleleCounts(this.HLA_DATA);

    // --- unique alleles ---
    this.getUniqueCounts(this.HLA_DATA);

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

    // console.log(alleleCount);
    return (alleleCount);
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
          unique_summary: _.countBy(values, 'allele'),
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
