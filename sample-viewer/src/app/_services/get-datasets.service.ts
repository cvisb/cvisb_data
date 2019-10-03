import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError, forkJoin } from 'rxjs';
import { map, catchError, mergeMap } from "rxjs/operators";

import { MyHttpClient } from './http-cookies.service';

import { environment } from "../../environments/environment";
import { ApiService } from './api.service';

import { ExperimentObjectPipe } from '../_pipes';

import { cloneDeep, uniqWith, isEqual, flatMapDeep } from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class getDatasetsService {
  schema_dataset: any;


  constructor(
    public http: HttpClient,
    public myhttp: MyHttpClient,
    public apiSvc: ApiService,
    private exptPipe: ExperimentObjectPipe
  ) {
    // this.getDatasets();
  }

  getDatasets() {
    return this.myhttp.get<any[]>(environment.api_url + "/api/dataset/query?q=__all__&size=1000", {
      observe: 'response',
      headers: new HttpHeaders()
        .set('Accept', 'application/json')
    }).pipe(
      mergeMap((ds_results: any) =>
        this.apiSvc.get("experiment",
          new HttpParams().set("q", `measurementTechnique:${ds_results['body']['hits'].map(d => `"${d.measurementTechnique}"`).join(",")}`)
            .set("facets", "measurementTechnique.keyword"), 0).pipe(
              map(expts => {
                let datasets = ds_results['body']['hits'];

                datasets.forEach(dataset => {
                  let cts = expts['facets']["measurementTechnique.keyword"]["terms"].filter(d => d.term === dataset.measurementTechnique);
                  dataset["expt_count"] = cts[0]['count'];
                })

                return (datasets)
              }),
              catchError(e => {
                console.log(e)
                throwError(e);
                return (new Observable<any>())
              })
            )
      ))
  }

  /*
  getDataset performs three operations:
  1. gets all DataDownloads for a particular dataset
  2. gets the Dataset metadata information for that dataset.
  3. gets the citations/publishers from experiment and attaches them to the dataset.
  ... and adds DataDownloads to Dataset in the `distribution` parameter,
  `citation`, and `publisher` as arrays.
   */
  getDataset(id: string, idVar: string = 'identifier'): Observable<any> {
    let measurementTechnique = this.exptPipe.transform(id, idVar);

    return forkJoin(
      this.apiSvc.fetchAllGeneric("datadownload", new HttpParams()
        .set('q', `includedInDataset:${id}`)
      ),
      this.myhttp.get<any[]>(environment.api_url + "/api/dataset/query", {
        observe: 'response',
        headers: new HttpHeaders()
          .set('Accept', 'application/json'),
        params: new HttpParams()
          .set("q", `measurementTechnique:"${measurementTechnique.name}"`)
          // .set('q', `${idVar}:${id}`)
      }),
      this.apiSvc.fetchAllGeneric("experiment",
        new HttpParams()
          .set("q", `measurementTechnique:"${measurementTechnique.name}"`)
          .set("fields", "citation,publisher"))
    )
      .pipe(
        map(([downloads, data, expts]) => {
          console.log("GET DATASET")
          console.log(data)
          console.log(downloads)
          console.log(expts)
          // downloads = downloads['hits'];
          if (data['body']['total'] === 1) {
            // One result found, as expected.
            let dataset = data['body']['hits'][0];

            // remove ES _id from files:
            downloads.forEach(d => {
              delete d._id;
              delete d._score;
            })

            delete dataset._id;
            delete dataset._score;

            let publishers = uniqWith(expts.map(d => d.publisher), isEqual).filter(d => d);
            let citations = uniqWith(flatMapDeep(expts, d => d.citation), isEqual).filter(d => d);

            // save DataDownloads to 'distribution' within dataset
            dataset['distribution'] = downloads;
            dataset["@context"] = "http://schema.org/";
            dataset["@type"] = "Dataset";
            dataset["publisher"] = publishers;
            dataset["citation"] = citations;
            console.log(dataset)
            return (dataset)
          } else {
            console.log("More than one dataset returned. Check if your ID is unique!")
            console.log(data);
          }
        }),
        catchError(e => {
          console.log(e)
          throwError(e);
          return (new Observable<any>())
        })
      )
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
    this.schema_dataset = cloneDeep(ds); // create copy

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
