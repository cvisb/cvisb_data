import { Injectable, PLATFORM_ID, Inject } from '@angular/core';

import { HttpParams } from '@angular/common/http';

import { ApiService } from './api.service';
import { ExperimentObjectPipe } from '../_pipes/experiment-object.pipe';
import { forkJoin, Observable, throwError } from 'rxjs/';
import { map, catchError } from 'rxjs/operators';

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

  getExptCounts() {
    let params = new HttpParams()
      .set('q', '__all__')
      .set('facets', 'includedInDataset.keyword')
      .set('facet_size', '1000')

    return this.apiSvc.get('experiment', params, 0).pipe(
      map(results => {
        let expts = results['facets']['includedInDataset.keyword']['terms'];

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
    exptCols: string[] = ["author", "batchID", "citation", "correction", "data", "dataStatus", "dateModified", "experimentDate", "experimentID", "privatePatientID", "publisher", "sampleID", "visitCode"],
    patientCols: string[] = ['patientID', 'alternateIdentifier', 'gID', 'sID', 'cohort', 'outcome', 'species', 'age', 'gender', 'country', 'admin2', 'admin3', 'infectionYear', 'infectionDate', 'evalDate', 'admitDate', 'dischargeDate', 'daysInHospital', 'daysOnset', 'elisa', 'publisher', 'citation', 'dataStatus', 'correction']): Observable<any> {
    console.log("getting experiments with id " + dataset_id)
    let expt_params = new HttpParams()
      .set('q', `includedInDataset:"${dataset_id}"`)
      .set('fields', exptCols.join(","));

    let patient_params = new HttpParams()
      .set('q', "__all__")
      .set('fields', patientCols.join(","))
      .set('experimentQuery', `includedInDataset:"${dataset_id}"`);

    //   return forkJoin(
    //     this.apiSvc.fetchAll("experiment", expt_params),
    //     this.apiSvc.fetchAll("patient", patient_params)
    //   ).pipe(
    //     map(([expts, patients]) => {
    //       console.log(expts)
    //       console.log(patients)
    //       return ({ patient: patients, experiment: expts });
    //     }
    //     ),
    //     catchError(e => {
    //       console.log(e)
    //       throwError(e);
    //       return (new Observable<any>())
    //     })
    //   )
    // }
    if (isPlatformBrowser(this.platformId)) {
    console.log("client")
    return this.apiSvc.fetchAll2("experiment", expt_params
    ).pipe(
      map(expts => {
        console.log(expts)
        return ({ patient: [], experiment: expts });
      }
      ),
      catchError(e => {
        console.log(e)
        throwError(e);
        return (new Observable<any>())
      })
    )
  } else {
    console.log('server')
  }
}

}
