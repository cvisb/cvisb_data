import { Injectable } from '@angular/core';

import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError, forkJoin, of, BehaviorSubject } from 'rxjs';
import { map, catchError, mergeMap, tap, finalize } from "rxjs/operators";
import { TransferState, makeStateKey } from '@angular/platform-browser';

import { MyHttpClient } from './http-cookies.service';

import { ApiService } from './api.service';

import { CountryObjectPipe } from '../_pipes/country-object.pipe';
import { ExperimentObjectPipe } from '../_pipes/experiment-object.pipe';

import { cloneDeep, uniqWith, uniq, isEqual, flatMapDeep } from 'lodash';
import * as _ from 'lodash';

const SOURCES_KEY = makeStateKey('datasets.sources_result');

@Injectable({
  providedIn: 'root'
})

export class getDatasetsService {
  schema_dataset: any;
  private sources_result;

  // Loading spinner
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loadingState$ = this.loadingSubject.asObservable();

  constructor(
    public http: HttpClient,
    public myhttp: MyHttpClient,
    public apiSvc: ApiService,
    private readonly transferState: TransferState,
    private countryPipe: CountryObjectPipe,
    private exptObjPipe: ExperimentObjectPipe
  ) {
  }

  getFiles(qString: string): Observable<any> {
    let params = new HttpParams()
      .set('q', qString);

    return this.apiSvc.fetchAll("datadownload", params).pipe(
      map(rs => {
        return (rs)
      })
    )
  }

  getDatasets(id?: string, idVar?: string) {
    let qstring: string;
    if (id && idVar) {
      qstring = `${idVar}:"${id}"`;
    } else {
      qstring = "__all__";
    }

    let params = new HttpParams()
      .set("q", qstring)

    return this.apiSvc.get("dataset", params, 1000)
      .pipe(
        // based on https://stackoverflow.com/questions/55516707/loop-array-and-return-data-for-each-id-in-observable (2nd answer)
        mergeMap((datasetResults: any) => {
          let summaryCalls = datasetResults['hits'].map(d => d.identifier).map(id => this.getDatasetCounts(id));
          return forkJoin(...summaryCalls).pipe(
            map((summaryData) => {
              let datasets = datasetResults['hits'];
              datasets.forEach((dataset, idx) => {
                dataset['counts'] = summaryData[idx];
              })
              // console.log(datasets);
              return datasets.sort((a, b) => a.measurementCategory < b.measurementCategory ? -1 : (a.measurementTechnique < b.measurementTechnique ? 0 : 1));
            }),
            catchError(e => {
              console.log(e)
              throwError(e);
              return (new Observable<any>())
            })
          )
        })
      );
  }

  getDatasetCounts(id): Observable<any> {
    return forkJoin(
      this.getPatientSummary(id), this.getDownloadsSummary(id), this.getExperimentCount(id)
    ).pipe(
      map(([patients, downloads, expts]) => {
        let summary = {};

        // pull out patient summary stats
        summary['cohorts'] = patients['facets']['cohort.keyword']['terms'];
        summary['all_cohorts'] = summary['cohorts'].map(d => d.term);

        summary['outcomes'] = patients['facets']['outcome.keyword']['terms'];
        summary['all_outcomes'] = summary['outcomes'].map(d => d.term);

        summary['years'] = patients['facets']['infectionYear']['terms'];
        summary['yearDomain'] = summary['years'].map(d => d.term);

        let countries = patients['facets']['country.identifier.keyword']['terms']
        countries.forEach(d => this.getCountryName(d));
        summary['countries'] = countries;


        // pull out file summary stats
        summary['files'] = downloads['facets']['additionalType.keyword']['terms'];
        summary['all_files'] = summary['files'].map(d => d.term);

        // pull out experiment summary stats
        summary['expt_count'] = expts['total'];

        return (summary);
      }),
      catchError(e => {
        console.log(e)
        throwError(e);
        return (new Observable<any>())
      })
    )
  }

  getExperimentCount(datasetID): Observable<any> {
    let params = new HttpParams()
      .set("q", `includedInDataset:"${datasetID}"`);

    return this.apiSvc.get("experiment", params, 0);
  }

  getPatientSummary(datasetID): Observable<any> {
    let params = new HttpParams()
      .set("q", "__all__")
      .set("experimentQuery", `includedInDataset:"${datasetID}"`)
      .set("facets", "cohort.keyword,outcome.keyword,country.identifier.keyword,infectionYear")
      .set("facet_size", "10000");

    return this.apiSvc.get("patient", params, 0);
  }

  getDownloadsSummary(datasetID): Observable<any> {
    let params = new HttpParams()
      .set("q", `includedInDataset:"${datasetID}"`)
      .set("facets", "additionalType.keyword")
      .set("facet_size", "10000");

    return this.apiSvc.get("datadownload", params, 0);
  }

  getCountryName(countryCount) {
    let countryObj = this.countryPipe.transform(countryCount.term);
    countryCount['name'] = countryObj['name'];
    countryCount['identifier'] = countryObj['identifier'];
    return (countryCount)
  }

  /*
  getDataset performs three operations:
  1. gets all DataDownloads for a particular dataset
  2. gets the Dataset metadata information for that dataset.
  3. gets the citations/publishers from experiment and attaches them to the dataset.
  ... and adds DataDownloads to Dataset in the `distribution` parameter,
  `citation`, and `publisher` as arrays.
   */
  getDataset(datasetID: string, idVar: string = "identifier"): Observable<any> {
    return forkJoin(
      this.apiSvc.fetchAll("datadownload", new HttpParams()
        .set('q', `includedInDataset:"${datasetID}"`)
      ),
      this.getDatasets(datasetID, idVar),
      this.getDatasetSources(datasetID))
      .pipe(
        map(([downloads, data, expts]) => {
          // console.log(data)
          // console.log(downloads)
          // console.log(expts)
          if (data.length === 1) {
            // One result found, as expected.
            let dataset = data[0];

            // remove ES _id from files:
            downloads.forEach(d => {
              delete d._id;
              delete d._score;
            })

            delete dataset._id;
            delete dataset._score;

            // save DataDownloads to 'distribution' within dataset
            dataset['distribution'] = downloads;
            dataset["@context"] = "http://schema.org/";
            dataset["@type"] = "Dataset";
            if (expts.length === 1) {
              dataset["source"] = expts[0].sources;
              dataset["citation"] = expts[0].sources.map(d => d.source);
            }
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

  /*
  Sequence of two calls to get citation/publisher/source object associated with experiments
  Call 1: get IDs of the sources, grouped by the datasetIDs
  https://dev.cvisb.org/api/experiment/query?q=__all__&size=0&facets=includedInDataset.keyword(citation.identifier.keyword)
  Call 2: get the source objects associated with them.
  Needs to be a POST call, to return a single object for a query.
   */
  getDatasetSources(dsid?: string): Observable<any> {
    this.loadingSubject.next(true);

    let citation_variable = "identifier";

    let qstring: string;
    if (dsid) {
      qstring = `includedInDataset:"${dsid}"`;
    } else {
      qstring = "__all__";
    }

    let params = new HttpParams()
      .set("q", qstring)
      .set("facets", `includedInDataset.keyword(sourceCitation.${citation_variable}.keyword)`)
      .set("size", "0")
      .set("facet_size", "10000");

    return this.apiSvc.get("experiment", params, 0)
      .pipe(
        mergeMap((citationCts: any) => {
          let counts = citationCts.facets["includedInDataset.keyword"].terms;
          let ids = uniq(flatMapDeep(counts.map(d => d[`sourceCitation.${citation_variable}.keyword`]), d => d.terms).map(d => d.term));
          let id_string = ids.join(",");

          return this.apiSvc.post("experiment", id_string, `sourceCitation.${citation_variable}`, "sourceCitation").pipe(
            map(citations => {
              let citation_dict = flatMapDeep(citations.body, d => d.sourceCitation);

              counts.forEach(dataset => {
                let ds_obj = this.exptObjPipe.transform(dataset.term, "dataset_id")
                dataset['dataset_name'] = ds_obj['dataset_name'];
                dataset['measurementCategory'] = ds_obj['measurementCategory'];
                dataset['sources'] = cloneDeep(dataset[`sourceCitation.${citation_variable}.keyword`]['terms']);
                delete dataset[`sourceCitation.${citation_variable}.keyword`];
                let dataset_total: number = dataset.sources.reduce((total: number, x) => total + x.count, 0);

                dataset.sources.forEach(source => {
                  let cite_objs = citation_dict.filter(d => d[citation_variable] == source.term);
                  // NOTE: since `citation` is an array, it's possible that a single call to POST to get
                  // the citation objects will return multiple copies of the same sourceCitation
                  // I'm assuming they're all the same, since they have the same identifier... so just grabbing the first one.
                  if (cite_objs.length > 0) {
                    source['source'] = cite_objs[0];
                  }
                  source['percent'] = source.count / dataset_total;
                })

              })
              return (counts.sort((a: any, b: any) => a.measurementCategory < b.measurementCategory ? -1 : (a.dataset_name < b.dataset_name ? 0 : 1)));
            }),
            catchError(e => {
              console.log(e)
              throwError(e);
              return (new Observable<any>())
            }),
            finalize(() => this.loadingSubject.next(false))
          )
        }
        )
      );
  }

  getPatientSources(): Observable<any> {
    this.loadingSubject.next(true);

    let citation_variable = "identifier";

    let qstring: string = "__all__";

    let params = new HttpParams()
      .set("q", qstring)
      .set("facets", `sourceCitation.${citation_variable}.keyword`)
      .set("size", "0")
      .set("facet_size", "10000");

    return this.apiSvc.get("patient", params, 0)
      .pipe(
        mergeMap((citationCts: any) => {
          console.log(citationCts)
          console.log(counts)
          let counts = citationCts.facets[`sourceCitation.${citation_variable}.keyword`]['terms'];
          let ids = uniq(counts.map(d => d.term));
          let id_string = ids.join(",");

          return this.apiSvc.post("patient", id_string, `sourceCitation.${citation_variable}`, "sourceCitation").pipe(
            map(citations => {
              console.log(citations)
              console.log(citationCts)
              let citation_dict = flatMapDeep(citations.body, d => d.sourceCitation);

              let total_citations =  counts.reduce((total: number, x) => total + x.count, 0);

              counts.forEach(source => {
                let cite_objs = citation_dict.filter(d => d[citation_variable] == source.term);
                // NOTE: since `citation` is an array, it's possible that a single call to POST to get
                // the citation objects will return multiple copies of the same sourceCitation
                // I'm assuming they're all the same, since they have the same identifier... so just grabbing the first one.
                if (cite_objs.length > 0) {
                  source['source'] = cite_objs[0];
                }
                source['percent'] = source.count / total_citations;
              })
              return (counts);
            }),
            catchError(e => {
              console.log(e)
              throwError(e);
              return (new Observable<any>())
            }),
            finalize(() => this.loadingSubject.next(false))
          )
        }
        )
      );
  }

  getAllSources() {
    const found = this.transferState.hasKey(SOURCES_KEY);

    if (found) {
      const res = of(this.transferState.get(SOURCES_KEY, null));
      this.transferState.remove(SOURCES_KEY);
      return res;
    } else {
      this.transferState.onSerialize(SOURCES_KEY, () => this.sources_result);
      // Send result --> this.result, which saves it to transferState
      return this.getPatientSources()
        // return forkJoin(
        //   this.getPatientSources(),
        //   this.getDatasetSources()
        // )
        .pipe(
          tap(patients => this.sources_result = patients)
          // tap(([patients, expts]) => this.sources_result = { patient: patients, dataset: expts })
        );
    }
  }

  //   return forkJoin(
  //     this.getPatientSources(),
  //     this.getDatasetSources()
  //   )
  //     .pipe(
  //       map(([patients, expts]) => {
  //         return ({ patient: patients, dataset: expts })
  //       }
  //       )
  //     )
  // }


  getSource(expts) {
    expts.forEach(d => {
      d['source'] = d.citation ? cloneDeep(d.citation) : (d.publisher ? cloneDeep(d.publisher) : {}); // safeguard against nulls
      if (d.citation) {
        d.source.forEach(inner =>
          inner['type'] = 'citation'
        )
      } else {
        d['source']['type'] = d.publisher ? 'publisher' : 'unknown';
      }
    })

    return (expts)
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
