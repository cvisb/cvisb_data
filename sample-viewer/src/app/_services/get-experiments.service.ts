import { Injectable } from '@angular/core';

import { HttpParams } from '@angular/common/http';

import { ApiService } from './api.service';
import { ExperimentObjectPipe } from '../_pipes/experiment-object.pipe';
import { forkJoin, Observable, throwError } from 'rxjs/';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GetExperimentsService {

  constructor(private apiSvc: ApiService, private exptPipe: ExperimentObjectPipe) { }

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

  getExptsPatients(dataset_id: string, patientCols: string[] = ['patientID', 'alternateIdentifier', 'cohort', 'outcome', 'age', 'gender']): Observable<any> {
    console.log("getting experiments with id "+ dataset_id)
    let expt_params = new HttpParams()
      .set('q', `includedInDataset:"${dataset_id}"`);

    let patient_params = new HttpParams()
      .set('q', "__all__")
      .set('fields', patientCols.join(","))
      .set('experimentQuery', `includedInDataset:"${dataset_id}"`);

    return forkJoin(
      this.apiSvc.fetchAll("experiment", expt_params),
      this.apiSvc.fetchAll("patient", patient_params)
    ).pipe(
      map(([expts, patients]) => {
        console.log(expts)
        console.log(patients)
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

}
