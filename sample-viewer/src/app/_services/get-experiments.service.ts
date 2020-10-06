import { Injectable, PLATFORM_ID, Inject } from '@angular/core';

import { HttpParams } from '@angular/common/http';

import { ApiService } from './api.service';
import { ExperimentObjectPipe } from '../_pipes/experiment-object.pipe';
import { forkJoin, Observable, throwError, from } from 'rxjs/';
import { map, catchError, pluck } from 'rxjs/operators';

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
      .set('fields', exptCols.join(","));

    return (this.apiSvc.fetchAll("experiment", expt_params));
  }

  getPatientsFromExpts(dataset_id: string, filterQuery: string, patientCols: string[] = ['patientID', 'alternateIdentifier', 'gID', 'sID', 'cohort', 'outcome', 'species', 'age', 'gender', 'country', 'admin2', 'admin3', 'infectionYear', 'infectionDate', 'evalDate',
    'admitDate', 'dischargeDate', 'daysInHospital', 'daysOnset', 'elisa', 'publisher', 'citation', 'dataStatus', 'correction']) {
    let patient_params = new HttpParams()
      .set('q', "__all__")
      .set('fields', patientCols.join(","))
      .set('experimentQuery', `includedInDataset:"${dataset_id}"`);

    return (this.apiSvc.fetchAll("patient", patient_params));
  }


  getDownloadList(id: String) {
    return forkJoin([this.getDownloadFacets(id), this.getPatientDownloadFacets(id), this.getDownloadResults(id, null), this.getFilteredPatientDownloadFacets(id, null)]).pipe(
      map(([exptFacets, patientFacets, exptData, patientSummary]) => {
        console.log(patientSummary)
        let filteredSummary = {};
        filteredSummary["cohorts"] = patientSummary["cohort.keyword"]["terms"];
        filteredSummary["outcomes"] = patientSummary["outcome.keyword"]["terms"];
        filteredSummary["species"] = patientSummary["species.keyword"]["terms"];
        filteredSummary["years"] = patientSummary["infectionYear"]["terms"];
        let countries = patientSummary["country.name.keyword"]["terms"];
        countries.forEach(d => this.getCountryName(d));
        filteredSummary["countries"] = countries;
        console.log(filteredSummary)

        // filter options
        const filterLabels = {
          "data.curated.keyword": "Curated Sequence",
          "data.virusSegment.keyword": "Virus Segment",
          "experimentDate.keyword": "Sample Date",
          "sourceCitation.name.keyword": "Source",
          "species.keyword": "Host",
          "country.name.keyword": "Country",
          "cohort.keyword": "Cohort",
          "infectionYear": "Infection Year",
          "outcome.keyword": "Outcome"
        };

        let filters = Object.keys(exptFacets).map(key => {
          const name = filterLabels[key];

          return ({
            key: key.replace(".keyword", ""),
            name: name ? name : key.replace(".keyword", ""),
            terms: exptFacets[key].terms
          })
        });

        let patientFilters = Object.keys(patientFacets).map(key => {
          const name = filterLabels[key];

          return ({
            key: key.replace(".keyword", ""),
            name: name ? name : key.replace(".keyword", ""),
            terms: patientFacets[key].terms
          })
        });

        filters = filters.concat(patientFilters);


        return ({
          total: exptData["total"],
          filteredSummary: filteredSummary,
          filters: filters,
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

  getDownloadFacets(id: String) {
    const exptFacets = ["data.curated", "data.virusSegment", "experimentDate", "sourceCitation.name", "citation.identifier"];

    let params = new HttpParams()
      .set('q', `includedInDataset:"${id}"`)
      .set('facets', exptFacets.map(d => `${d}.keyword`).join(","))
      .set('facet_size', '1000')

    return this.apiSvc.get('experiment', params, 0).pipe(
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

  getPatientDownloadFacets(id: String) {
    const patientFacets = ["cohort.keyword", "outcome.keyword", "species.keyword", "infectionYear", "country.name.keyword"];

    let params = new HttpParams()
      .set('q', "__all__")
      .set("experimentQuery", `includedInDataset:"${id}"`)
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

  getFilteredPatientDownloadFacets(id: String, filters: any) {
    const patientFacets = ["cohort.keyword", "outcome.keyword", "species.keyword", "infectionYear", "country.name.keyword"];

    let params = new HttpParams()
      .set('q', "__all__")
      .set("experimentQuery", `includedInDataset:"${id}"`)
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

  getDownloadResults(id: String, filters: any) {
    const patientFields = ["patientID", "cohort", "species", "infectionYear"];
    // const exptFields = ["experimentID", "privatePatientID", "experimentDate"];

    let params = new HttpParams()
      .set('q', "__all__")
      .set('experimentQuery', `includedInDataset:"${id}"`)
      .set('fields', patientFields.join(","))

    return this.apiSvc.get('patient', params, 10).pipe(
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

  getCountryName(countryCount) {
    let countryObj = this.countryPipe.transform(countryCount.term);
    countryCount['name'] = countryObj['name'];
    countryCount['identifier'] = countryObj['identifier'];
    return (countryCount)
  }

}
