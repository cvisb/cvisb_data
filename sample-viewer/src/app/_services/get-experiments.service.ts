import { Injectable, PLATFORM_ID, Inject } from '@angular/core';

import { HttpParams } from '@angular/common/http';

import { ApiService } from './api.service';
import { ExperimentObjectPipe } from '../_pipes/experiment-object.pipe';
import { forkJoin, Observable, throwError, from } from 'rxjs/';
import { map, catchError, pluck, mergeMap } from 'rxjs/operators';

import { CountryObjectPipe } from '../_pipes/country-object.pipe';

import { ExperimentCount } from "../_models";

import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class GetExperimentsService {

  constructor(private apiSvc: ApiService,
    private countryPipe: CountryObjectPipe,
    private exptPipe: ExperimentObjectPipe,
    @Inject(PLATFORM_ID) private platformId: Object) { }

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

  getExptsPatients(dataset_id: string, filter_string: string): Observable<any> {
    return forkJoin(
      this.getExpts(dataset_id, filter_string),
      this.getPatientsFromExpts(dataset_id, filter_string)
    ).pipe(
      map(([expts, patients]) => {
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

  getExpts(dataset_id: string, filterQuery: string, exptCols: string[] = ["batchID", "citation", "correction", "creator", "data", "dataStatus", "dateModified", "experimentDate", "experimentID", "privatePatientID", "publisher", "sampleID", "visitCode"]) {
    let expt_params = new HttpParams()
      .set('q', `includedInDataset:"${dataset_id}"`)
      .set('patientQuery', filterQuery)
      .set('fields', exptCols.join(","));

    return (this.apiSvc.fetchAll("experiment", expt_params));
  }

  getPatientsFromExpts(dataset_id: string, filterQuery: string, patientCols: string[] = ['patientID', 'alternateIdentifier', 'gID', 'sID', 'cohort', 'outcome', 'species', 'age', 'gender', 'country', 'admin2', 'admin3', 'infectionYear', 'infectionDate', 'evalDate',
    'admitDate', 'dischargeDate', 'daysInHospital', 'daysOnset', 'elisa', 'publisher', 'citation', 'dataStatus', 'correction']) {
    let patient_params = new HttpParams()
      .set('q', filterQuery !== "" ? filterQuery : "__all__")
      .set('fields', patientCols.join(","))
      .set('experimentQuery', `includedInDataset:"${dataset_id}"`);

    return (this.apiSvc.fetchAll("patient", patient_params));
  }

  /*
  Function for /download to grab the initial results for the page load.
  Grabs:
  1. Summary of patient facets for filtering, summary box (no filters applied, unless specified by the URL)
  2. Summary of expt facets for filtering, summary box
  3. Table of results to display

  On filter application, will re-call this function with filters applied
  */
  getDownloadData(id: string) {
    return forkJoin([this.getExptTable(id, null, null), this.getFilteredPatientDownloadFacets(id, null, null)]).pipe(
      map(([exptData, patientSummary]) => {
        console.log(patientSummary)
        let filteredSummary = {};
        filteredSummary["cohorts"] = patientSummary["cohort.keyword"]["terms"];
        filteredSummary["outcomes"] = patientSummary["outcome.keyword"]["terms"];
        filteredSummary["species"] = patientSummary["species.keyword"]["terms"];
        filteredSummary["years"] = patientSummary["infectionYear"]["terms"];
        let countries = patientSummary["country.identifier.keyword"]["terms"];
        countries.forEach(d => this.getCountryName(d));
        filteredSummary["countries"] = countries;
        console.log(filteredSummary)

        Object.keys(filteredSummary).forEach(facet => {
          filteredSummary[facet].forEach(d => {
            d["selected"] = false;
          })
        })

        // filter options
        const filterLabels = {
          "data.curated.keyword": "Curated Sequence",
          "data.virusSegment.keyword": "Virus Segment",
          "experimentDate.keyword": "Sample Date",
          "sourceCitation.name.keyword": "Source",
          "species.keyword": "Host",
          "country.identifier.keyword": "Country",
          "cohort.keyword": "Cohort",
          "infectionYear": "Infection Year",
          "outcome.keyword": "Outcome"
        };

        return ({
          total: exptData["total"],
          filteredSummary: filteredSummary,
          results: exptData
        })
      }),
      catchError(err => {
        console.log(`%c Error getting download list of experiments`, "color: orange")
        console.log(err)
        return from([]);
      })
    )
  }

  getExptFacets(id: string, patientFilter: string, exptFilter: string) {
    const exptFacets = ["data.curated", "data.virusSegment", "experimentDate", "sourceCitation.name", "citation.identifier"];

    let params = new HttpParams()
      .set('q', `includedInDataset:"${id}"`)
      .set('facets', exptFacets.map(d => `${d}.keyword`).join(","))
      .set('facet_size', '1000')

    return this.apiSvc.get('experiment', params, 0).pipe(
      pluck("facets"),
      map((expts: any) => {
        return (expts)
      }),
      catchError(err => {
        console.log(`%c Error getting download list of experiments`, "color: orange")
        console.log(err)
        return from([]);
      })
    )
  }

  getFilteredPatientDownloadFacets(id: string, patientFilter: string, exptFilter: string) {
    const patientFacets = ["cohort.keyword", "outcome.keyword", "species.keyword", "infectionYear", "country.identifier.keyword"];

    let patientQuery = patientFilter ? patientFilter : "__all__";
    let exptQuery = exptFilter ? `includedInDataset:"${id}"` : `includedInDataset:"${id}"`;

    let params = new HttpParams()
      .set('q', patientQuery)
      .set("experimentQuery", exptQuery)
      .set('facets', patientFacets.map(d => `${d}`).join(","))
      .set('facet_size', '1000')

    return this.apiSvc.get('patient', params, 0).pipe(
      pluck("facets"),
      map((expts: any) => {
        console.log(expts)
        return (expts)
      }),
      catchError(err => {
        console.log(`%c Error getting download list of experiments`, "color: orange")
        console.log(err)
        return from([]);
      })
    )
  }

  getExptTable(id: string, patientFilter: string, exptFilter: string, size: number = 10) {
    const dwnldFields = ["name", "contentUrl", "additionalType"];

    let patientQuery = patientFilter ? patientFilter : "__all__";
    let exptQuery = exptFilter ? `includedInDataset:"${id}"` : `includedInDataset:"${id}"`;

    return this.getExpts4Table(patientQuery, exptQuery, size).pipe(
      mergeMap(expts => forkJoin(this.getPatients4Table(expts["hits"].map(d => d.experimentID)), this.getPatients4Table(expts["hits"].map(d => d.experimentID))).pipe(
        map(([patients, dwnloads]) => {
          // Join together patients and expt data for the table.
          let merged = expts.hits.map(expt => {
            let idx = patients.findIndex(patient => patient.alternateIdentifier.includes(expt.privatePatientID))
            if (idx > -1) {
              return ({ ...expt, ...patients[idx] })
            } else {
              return (expt)
            }
          })

          return ({ hits: merged, total: expts.total })
        })
      )
      ),
      catchError(err => {
        console.log(`%c Error getting download list of experiments`, "color: orange")
        console.log(err)
        return from([]);
      })
    )
  }

  getExpts4Table(patientQuery: string, exptQuery: string, size: number) {
    const exptFields = ["experimentID", "privatePatientID", "experimentDate", "dateModified"];
    let params = new HttpParams()
      .set('q', exptQuery)
      .set('fields', exptFields.join(","));

    if (patientQuery != "__all__") {
      params.set("patientQuery", patientQuery)
    }

    return this.apiSvc.get("experiment", params, size).pipe(
      map((expts: any) => {
        console.log(expts)
        return (expts)
      }),
      catchError(err => {
        console.log(`%c Error getting download list of experiments`, "color: orange")
        console.log(err)
        return from([]);
      })
    )
  }

  getPatients4Table(exptIDs: string[]) {
    const patientFields = ["patientID", "alternateIdentifier", "cohort", "species", "infectionYear"];

    let params = new HttpParams()
      .set('q', "__all__")
      .set('experimentQuery', `experimentID:("${exptIDs.join('","')}")`)
      .set('fields', patientFields.join(","));

    return this.apiSvc.get("patient", params).pipe(
      pluck("hits"),
      map((patients: any) => {
        console.log(patients)
        return (patients)
      }),
      catchError(err => {
        console.log(`%c Error getting download list of patients`, "color: orange")
        console.log(err)
        return from([]);
      })
    )
  }

  getCountryName(countryCount) {
    let countryObj = this.countryPipe.transform(countryCount.term);
    countryCount['name'] = countryObj['name'];
    countryCount['identifier'] = countryObj['identifier'];
    return (countryCount)
  }

}
