import { Injectable } from '@angular/core';

import { nest } from 'd3';
import * as d3 from 'd3';
import * as _ from 'lodash';
import { HLA, D3Nested } from '../_models';

import { Observable, Subject, BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class GetHlaDataService {
  patientTypes: D3Nested[];
  patientOutcomes: D3Nested[];
  patientCount: number;
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


  constructor() {
    this.summarizeHLA();
  }

  getHLAdata() {
    return HLA_DATA;
  }

  summarizeHLA() {
    // TODO: figure better way?  Lodash only takes the first (?) value for the data, so doesn't check if there are unique ID/cohort combos.  Which should be okay, but not ideal.
    let unique_IDs = _.uniqBy(HLA_DATA, d => d.ID)

    this.patientCountSubject.next(unique_IDs.length);

    let patientOutcomes = nest()
      .key((d: HLA) => d.outcome)
      .rollup((values: any) => values.length)
      .entries(unique_IDs);

    this.patientOutcomeSubject.next(patientOutcomes);


    // _.countBy(unique_IDs, 'outcome');
    let patientTypes = nest()
      .key((d: HLA) => d.Status)
      .rollup((values: any) => values.length)
      .entries(unique_IDs);

    this.patientTypeSubject.next(patientTypes);

    // --- unique alleles ---
    this.getAlleleCounts();

    // --- unique alleles ---
    this.getUniqueCounts();

  }

  getAlleleCounts() {
    let alleleCount = nest()
      .key((d: HLA) => d.loci)
      .key((d: HLA) => d.allele_short)
      .rollup(function(values: any): any {
        return {
          total: values.length,
          novel: values.map((patient: HLA) => patient.novel).every((d: any) => d)
        }
      })
      .entries(HLA_DATA);

    alleleCount.forEach((d: D3Nested) => { d.count = d.values.length });

    this.alleleCountSubject.next(alleleCount);

    console.log(alleleCount);
    return (alleleCount);
  }

  getUniqueCounts() {
    let novelAlleles = nest()
      .key((d: HLA) => d.loci)
      .rollup(function(values: any): any {
        return {
          total: values.length,
          data: values,
          alleles: values.map((patient: HLA) => patient.allele_short),
          unique_alleles: d3.map(values, (patient: HLA) => patient.allele_short).keys(),
          unique_summary: _.countBy(values, 'allele_short'),
          unique_total: d3.map(values, (patient: HLA) => patient.allele_short).keys().length
        }
      })
      .entries(HLA_DATA.filter((d: HLA) => d.novel === true));

    novelAlleles.forEach((d: any) =>
      d.count = d.value.unique_total
    )

    this.novelAllelesSubject.next(novelAlleles);
    return (novelAlleles);
  }

}

const HLA_DATA =
[{"outcome":"control","Status":"Control","ID":"testpatient","loci":"A","allele_short":"A*340201","novel":false}]
