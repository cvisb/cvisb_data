import { Injectable } from '@angular/core';

import { ApiService } from './api.service';

import { Observable, forkJoin } from "rxjs/";
import { map } from "rxjs/operators";
import { HttpParams } from '@angular/common/http';

import { flatMapDeep } from 'lodash';

@Injectable({
  providedIn: 'root'
})

export class GetAlignedSequencesService {

  constructor(private apiSvc: ApiService) { }
  // https://dev.cvisb.org/api/experiment/query?q=measurementTechnique:%20"viral%20sequencing"&size=2&patientQuery=age:22


  // gets sequence count, based on the filters applied.
  getNumSequences(virus): Observable<number> {
    let qParams = new HttpParams()
      .append("q", `measurementCategory:"virus sequencing" AND data.virus:${virus}`)

    return this.apiSvc.get("experiment", qParams, 0)
      .pipe(
        map(results => {
          return (results['total'])
        })
      )
  }

  // gets the sequence country and publication options
  getFilterOpts(virus: string) {
    forkJoin(this.getCountries(virus), this.getPubs(virus))
      .pipe(
        map(([countries, pubs]) => {
          // forkJoin returns an array of values, here we map those values to an object
          return ({ countries: countries, publications: pubs });
        })
      );
  }

  // gets countries for patients that have been sequenced.
  // https://dev.cvisb.org/api/patient/query?q=__all__&size=0&facets=country.name.keyword&experimentQuery=measurementTechnique:%22viral%20sequencing%22%20AND%20data.virus:Lassa
  getCountries(virus): Observable<string[]> {
    let qParams = new HttpParams()
      .append("q", "__all__")
      .append("experimentQuery", `measurementCategory:"virus sequencing" AND data.virus:${virus}`)
      .append("facets", "country.name.keyword")
      .append("facet_size", "10000");

    return this.apiSvc.get("patient", qParams, 0)
      .pipe(
        map(results => {
          console.log(results)
          let countries = results['facets']['country.name.keyword']['terms'].map(d => d.term);

          return (countries)
        })
      )
  }

  // gets publication IDs
  // https://dev.cvisb.org/api/experiment/query?q=measurementTechnique:%20%22viral%20sequencing%22&size=0&facets=publication.DOI.keyword
  getPubs(virus): Observable<string[]> {
    let qParams = new HttpParams()
      .append("q", `measurementTechnique:"virus sequencing" AND data.virus:${virus}`)
      .append("facets", "publication.DOI.keyword")
      .append("facet_size", "10000");

    return this.apiSvc.get("experiment", qParams, 0)
      .pipe(
        map(results => {
          console.log(results)
          let countries = results['facets']['publication.DOI.keyword']['terms'].map(d => d.term);

          return (countries)
        })
      )
  }

  // Grabs both the sequencing data and the patient metadata.
  getSeqData(virus: string) {
    forkJoin(this.getAlignedSequences(virus), this.getPatientMetadata(virus))
      .pipe(
        map(([sequences, metadata]) => {
          // forkJoin returns an array of values, here we map those values to an object
          return ({ seq: sequences, patients: metadata });
        })
      );
  }


  // gets aligned sequences
  // https://dev.cvisb.org/api/experiment/query?q=measurementTechnique:%20%22viral%20sequencing%22%20AND%20data.virus:Lassa
  getAlignedSequences(virus: string): Observable<any> {
    // Fasta data prep
    let qParams = new HttpParams()
      .append("q", `measurementTechnique:"virus sequencing" AND data.virus:${virus}`)


    return this.apiSvc.get("experiment", qParams)
      .pipe(
        map(results => {
          let dnaData = flatMapDeep(results["hits"],
            d => d.data.map(data => {
              return ({ name: d.experimentID, seq: data.DNAsequence })
            }));

          return (dnaData)
        })
      )

  }


  // Gets patient data associated with the query
  // ex: https://dev.cvisb.org/api/patient/query?q=__all__&size=2&experimentQuery=measurementTechnique:%22viral%20sequencing%22
  getPatientMetadata(virus: string): Observable<any> {
    // Fasta data prep
    let qParams = new HttpParams()
      .append("q", `__all__`)
      .append("experimentQuery", `measurementTechnique:"virus sequencing" AND data.virus:${virus}`)

    return this.apiSvc.get("patient", qParams)
      .pipe(
        map(results => {
          return (results['hits'])
        })
      )
  }

}
