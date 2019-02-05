import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { map } from "rxjs/operators";

import { environment } from "../../environments/environment";
import { PutService } from './put.service';

import * as _ from 'lodash';

import FILES from '../../assets/data/dataset_public.json';

@Injectable({
  providedIn: 'root'
})
export class getDatasetsService {
  schema_dataset: any;


  constructor(
    public http: HttpClient,
    public putSvc: PutService
  ) {
    this.getDatasets();
    // this.putFiles(FILES);
    //
    putSvc.getIDs(FILES, 'dataset', 'identifier')
  }

  getDatasets() {
    return this.http.get<any[]>(environment.api_url + "/api/dataset/query?q=__all__&size=1000", {
      // this.http.get<any[]>(environment.host_url + "/api/sample/test_2", {
      observe: 'response',
      headers: new HttpHeaders()
        .set('Accept', 'application/json')
    }).pipe(
      map(data => {
        let files = data['body']['hits'];
        console.log(files)

        return (files)

        // send new patients to subscription services.
        // this.patientsSubject.next(this.patients);
        // this.patientsSubject.next(patients);
      }))
    // err => {
    //   console.log('Error in getting files')
    //   // console.log(err)
    // })
  }

  getDataset(id: string, idVar: string = 'identifier') {
    return this.http.get<any[]>(environment.api_url + "/api/dataset/query", {
      // this.http.get<any[]>(environment.host_url + "/api/sample/test_2", {
      observe: 'response',
      headers: new HttpHeaders()
        .set('Accept', 'application/json'),
      params: new HttpParams()
        .set('q', `${idVar}:\"${id}\"`)
    }).pipe(
      map(data => {
        let files = data['body']['hits'];
        console.log(files)

        return (files)
      }))
  }

  putFiles(datasets: any[]) {
    console.log('attempting to add new record')
    // console.log(this.jsonify(datasets));
    this.http.put<any[]>(environment.api_url + "/api/dataset",
      this.jsonify(datasets),
      {
        // observe: 'response',
        headers: new HttpHeaders()
        // .set('data', )
      }).subscribe(resp => {
        console.log(resp)
      },
        err => {
          console.log(err)
        })
  }

  getSchema(dsid: string) {
    // TODO: check if more than one dataset.
    let dataset = FILES.filter((d: any) => d.identifier === dsid)[0];
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
