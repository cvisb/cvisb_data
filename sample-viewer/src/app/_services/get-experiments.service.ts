import { Injectable, PLATFORM_ID, Inject } from '@angular/core';

import { HttpParams } from '@angular/common/http';

import { ApiService } from './api.service';
import { ExperimentObjectPipe } from '../_pipes/experiment-object.pipe';
import { forkJoin, Observable, throwError, from } from 'rxjs/';
import { map, catchError, pluck } from 'rxjs/operators';

import { ExperimentCount } from "../_models";

import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class GetExperimentsService {

  constructor(private apiSvc: ApiService, private exptPipe: ExperimentObjectPipe, @Inject(PLATFORM_ID) private platformId: Object) { }

  getExpt(patientID: string, dataset_id: string) {
    let qString = `includedInDataset:"${dataset_id}"`;

    let params = new HttpParams()
      .set('q', qString)
      .set('patientID', patientID);

    return (this.apiSvc.get('experiment', params));
  }

  getExptCounts(): Observable<ExperimentCount[]> {
    let params = new HttpParams()
      .set('q', '__all__')
      .set('facets', 'includedInDataset.keyword')
      .set('facet_size', '1000')

    return this.apiSvc.get('experiment', params, 0).pipe(
      pluck("facets"),
      pluck("includedInDataset.keyword"),
      pluck("terms"),
      map((expts: ExperimentCount[]) => {
        expts.forEach(d => {
          let filtered = this.exptPipe.transform(d['term'], 'dataset_id');
          d['datasetName'] = filtered['datasetName'];
          d['measurementCategory'] = filtered['measurementCategory'];
        })
        return (expts.sort((a, b) => a.measurementCategory < b.measurementCategory ? -1 : (a.datasetName < b.datasetName ? 0 : 1)));
      })
    );
  }

  getExptsPatients(dataset_id: string,
    exptCols: string[] = ["batchID", "citation", "correction", "creator", "data", "dataStatus", "dateModified", "experimentDate", "experimentID", "privatePatientID", "publisher", "sampleID", "visitCode"],
    patientCols: string[] = ['patientID', 'alternateIdentifier', 'gID', 'sID', 'cohort', 'outcome', 'species', 'age', 'gender', 'country', 'admin2', 'admin3', 'infectionYear', 'infectionDate', 'evalDate',
      'admitDate', 'dischargeDate', 'daysInHospital', 'daysOnset', 'elisa', 'publisher', 'citation', 'dataStatus', 'correction']): Observable<any> {
    // console.log("getting experiments with id " + dataset_id)
    let expt_params = new HttpParams()
      .set('q', `includedInDataset:"${dataset_id}"`)
      .set('fields', exptCols.join(","));

    let patient_params = new HttpParams()
      .set('q', "__all__")
      .set('fields', patientCols.join(","))
      .set('experimentQuery', `includedInDataset:"${dataset_id}"`);

    return forkJoin(
      this.apiSvc.fetchAll("experiment", expt_params),
      this.apiSvc.fetchAll("patient", patient_params)
    ).pipe(
      map(([expts, patients]) => {
        // console.log(expts)
        // console.log(patients)
        return ({ patient: patients, experiment: expts });
      }
      ),
      catchError(e => {
        console.log(e)
        throwError(e);
        return (new Observable<any>())
      })
    )
  }
  //     if (isPlatformBrowser(this.platformId)) {
  //     console.log("client")
  //     return this.apiSvc.fetchAll("experiment", expt_params
  //     ).pipe(
  //       map(expts => {
  //         console.log(expts)
  //         return ({ patient: [], experiment: expts });
  //       }
  //       ),
  //       catchError(e => {
  //         console.log(e)
  //         throwError(e);
  //         return (new Observable<any>())
  //       })
  //     )
  //   } else {
  //     console.log('server')
  //   }
  // }

  getDownloadList(id: String) {
    return forkJoin([this.getDownloadFacets(id), this.getPatientDownloadFacets(id), this.getDownloadResults(id, null), this.getFilteredPatientDownloadFacets(id, null)]).pipe(
      map((expts: any) => {
        console.log(expts)
      }),
      catchError(err => {
        console.log(`%c Error getting download list of experiments`, "color: orange")
        console.log(err)
        return from([]);
      })
    )
  }

  getDownloadFacets(id: String) {
    const exptFacets = ["data.curated", "data.virusSegment", "experimentDate", "sourceCitation.name", "citation.identifier"];

    let params = new HttpParams()
      .set('q', `includedInDataset:"${id}"`)
      .set('facets', exptFacets.map(d => `${d}.keyword`).join(","))
      .set('facet_size', '1000')

    return this.apiSvc.get('experiment', params, 0).pipe(
      map((expts: any) => {
        console.log(expts)
        return(expts)
      }),
      catchError(err => {
        console.log(`%c Error getting download list of experiments`, "color: orange")
        console.log(err)
        return from([]);
      })
    )
  }

  getPatientDownloadFacets(id: String) {
    const patientFacets = ["cohort", "species", "infectionYear"];

    let params = new HttpParams()
      .set('q', "__all__")
      .set("experimentQuery", `includedInDataset:"${id}"`)
      .set('facets', patientFacets.map(d => `${d}.keyword`).join(","))
      .set('facet_size', '1000')

    return this.apiSvc.get('experiment', params, 0).pipe(
      map((expts: any) => {
        console.log(expts)
        return(expts)
      }),
      catchError(err => {
        console.log(`%c Error getting download list of experiments`, "color: orange")
        console.log(err)
        return from([]);
      })
    )
  }

  getFilteredPatientDownloadFacets(id: String, filters: any) {
    const patientFacets = ["cohort", "species", "infectionYear"];

    let params = new HttpParams()
      .set('q', "__all__")
      .set("experimentQuery", `includedInDataset:"${id}"`)
      .set('facets', patientFacets.map(d => `${d}.keyword`).join(","))
      .set('facet_size', '1000')

    return this.apiSvc.get('experiment', params, 0).pipe(
      map((expts: any) => {
        console.log(expts)
        return(expts)
      }),
      catchError(err => {
        console.log(`%c Error getting download list of experiments`, "color: orange")
        console.log(err)
        return from([]);
      })
    )
  }

  getDownloadResults(id: String, filters: any) {
    const exptFields = ["experimentID", "privatePatientID", "experimentDate"];

    let params = new HttpParams()
      .set('q', `includedInDataset:"${id}"`)
      .set('fields', exptFields.join(","))

    return this.apiSvc.get('experiment', params, 10).pipe(
      map((expts: any) => {
        console.log(expts)
        return(expts)
      }),
      catchError(err => {
        console.log(`%c Error getting download list of experiments`, "color: orange")
        console.log(err)
        return from([]);
      })
    )
  }


}
