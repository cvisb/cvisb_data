import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, Subject, BehaviorSubject, throwError } from 'rxjs';
import { map, catchError } from "rxjs/operators";

import { MyHttpClient } from './http-cookies.service';

import { environment } from "../../environments/environment";
import { PutService } from './put.service';

import * as _ from 'lodash';

import DATASETS from '../../assets/data/dataset_public.json';

@Injectable({
  providedIn: 'root'
})
export class getDatasetsService {
  schema_dataset: any;


  constructor(
    public http: HttpClient,
    public myhttp: MyHttpClient,
    public putSvc: PutService
  ) {
    this.getDatasets();
    putSvc.put(DATASETS, 'dataset', 'identifier')
  }

  getDatasets() {
    return this.myhttp.get<any[]>(environment.api_url + "/api/dataset/query?q=__all__&size=1000", {
      observe: 'response',
      headers: new HttpHeaders()
        .set('Accept', 'application/json')
    }).pipe(
      map(data => {
        let datasets = data['body']['hits'];
        // console.log(files)

        return (datasets)

        // send new patients to subscription services.
        // this.patientsSubject.next(this.patients);
        // this.patientsSubject.next(patients);
      }))
    // err => {
    //   console.log('Error in getting datasets')
    //   // console.log(err)
    // })
  }

  getDataset(id: string, idVar: string = 'identifier') {
    return this.myhttp.get<any[]>(environment.api_url + "/api/dataset/query", {
      observe: 'response',
      headers: new HttpHeaders()
        .set('Accept', 'application/json'),
      params: new HttpParams()
        .set('q', `${idVar}:${id}`)
    }).pipe(
      map(data => {
        if (data['body']['total'] === 1) {
          // One result found, as expected.
          let datasets = data['body']['hits'];
          return (datasets[0])
        } else {
          console.log("More than one dataset returned. Check if your ID is unique!")
        }
      }),
      catchError(e => {
        console.log(e)
        throwError(e);
        return(new Observable<any>())
      })
    )
  }


  getSchema(dsid: string) {
    // TODO: check if more than one dataset.
    let dataset = DATASETS.filter((d: any) => d.identifier === dsid)[0];
    return (this.removeNonSchema(dataset));
  }

  // Function to convert
  jsonify(arr: any[]): string {
    let json_arr = [];

    for (let record of arr) {
      json_arr.push(JSON.stringify(record))
    }
    return (json_arr.join("\n"))
  }

  removeNonSchema(ds) {
    this.schema_dataset = _.cloneDeep(ds); // create copy

    // remove stuff from the dataset object
    let schemaorg = ["@context", "@type", "identifier", "name", "description", "url", "@id", "keywords", "measurementTechnique", "variableMeasured", "datePublished", "dateModified", "temporalCoverage", "spatialCoverage", "includedInDataCatalog", "author", "publisher", "version", "schemaVersion", "distribution"];
    // removes "sourceCode" -- different name in schema.org
    for (let key of Object.keys(this.schema_dataset)) {
      if (!schemaorg.includes(key)) {
        // console.log('deleting ' + key)
        delete this.schema_dataset[key];
      }
      return (this.schema_dataset)
    }

    // remove stuff from individual files
    let schemaorg_distrib = ["@type", "name", "description", "keywords", "version", "additionalType", "encodingFormat", "measurementTechnique", "datePublished", "dateModified", "@id", "contentUrl"];
    for (let file of this.schema_dataset['distribution']) {
      let keys = Object.keys(file);

      for (let key of keys) {
        if (!schemaorg_distrib.includes(key)) {
          delete file[key];
        }
      }
    }
  }


}
