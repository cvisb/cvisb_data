import { Injectable, PLATFORM_ID, Inject } from '@angular/core';

import { HttpParams } from '@angular/common/http';

import { ApiService } from './api.service';
import { ExperimentObjectPipe } from '../_pipes/experiment-object.pipe';
import { forkJoin, Observable, throwError, from, BehaviorSubject } from 'rxjs/';
import { map, catchError, pluck, mergeMap, finalize , tap} from 'rxjs/operators';
import { cloneDeep } from "lodash";

import { CountryObjectPipe } from '../_pipes/country-object.pipe';

import { ExperimentCount } from "../_models";

@Injectable({
  providedIn: 'root'
})

export class GetExperimentsService {
  // Loading spinner
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  public isLoadingState$ = this.isLoadingSubject.asObservable();


  constructor(private apiSvc: ApiService,
    private countryPipe: CountryObjectPipe,
    private exptPipe: ExperimentObjectPipe,
    @Inject(PLATFORM_ID) private platformId: Object) { }

  getExpt(patientID: string, dataset_id: string) {
    let qString = `includedInDataset.keyword:"${dataset_id}"`;

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
      tap(d => console.log(d)),
      pluck("facets"),
      pluck("includedInDataset.keyword"),
      pluck("terms"),
      map((expts: ExperimentCount[]) => {
        expts.forEach(d => {
          let filtered = this.exptPipe.transform(d['term'], 'dataset_id');
          d['datasetName'] = filtered['datasetName'];
          d['icon'] = filtered['icon_id'];
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
      .set('q', `includedInDataset.keyword:"${dataset_id}"`)
      .set('patientQuery', filterQuery)
      .set('fields', exptCols.join(","));

    return (this.apiSvc.fetchAll("experiment", expt_params));
  }

  getPatientsFromExpts(dataset_id: string, filterQuery: string, patientCols: string[] = ['patientID', 'alternateIdentifier', 'gID', 'sID', 'cohort', 'outcome', 'species', 'age', 'gender', 'country', 'admin2', 'admin3', 'infectionYear', 'infectionDate', 'evalDate',
    'admitDate', 'dischargeDate', 'daysInHospital', 'daysOnset', 'elisa', 'publisher', 'citation', 'dataStatus', 'correction']) {
    let patient_params = new HttpParams()
      .set('q', filterQuery !== "" ? filterQuery : "__all__")
      .set('fields', patientCols.join(","))
      .set('experimentQuery', `includedInDataset.keyword:"${dataset_id}"`);

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
  getDownloadData(id: string, summaryData: any, patientFilters: any) {
    this.isLoadingSubject.next(true);

    let patientQueryArr = patientFilters.filter(d => d.terms.length).map(facet => `${facet.key}:("${facet.terms.map(x => x.term).join('" OR "')}")`);
    let patientQuery = patientQueryArr.join(" AND ");

    return forkJoin([this.getExptTable(id, patientQuery, null), this.getFilteredPatientDownloadFacets(id, patientQuery, null)]).pipe(
      map(([exptData, patientSummary]) => {
        let filteredSummary = {};
        let summary = summaryData;

        if (summaryData) {
          // update the counts
          filteredSummary = cloneDeep(summaryData);

          filteredSummary["cohort"] = this.updateFacets(filteredSummary, patientSummary, patientFilters, "cohort", "cohort.keyword");
          filteredSummary["outcome"] = this.updateFacets(filteredSummary, patientSummary, patientFilters, "outcome", "outcome.keyword");
          filteredSummary["species"] = this.updateFacets(filteredSummary, patientSummary, patientFilters, "species", "species.keyword");
          filteredSummary["year"] = this.updateFacets(filteredSummary, patientSummary, patientFilters, "year", "infectionYear");
          filteredSummary["country"] = this.updateFacets(filteredSummary, patientSummary, patientFilters, "country", "country.identifier.keyword");

        } else {
          // initial call; create the static summary object and populate.
          filteredSummary["cohort"] = patientSummary["cohort.keyword"]["terms"];
          filteredSummary["outcome"] = patientSummary["outcome.keyword"]["terms"];
          filteredSummary["species"] = patientSummary["species.keyword"]["terms"];
          filteredSummary["year"] = patientSummary["infectionYear"]["terms"];
          let countries = patientSummary["country.identifier.keyword"]["terms"];
          countries.forEach(d => this.getCountryName(d));
          filteredSummary["country"] = countries;

          summary = filteredSummary;

          Object.keys(filteredSummary).forEach(facet => {
            filteredSummary[facet].forEach(d => {
              d["selected"] = patientFilters.filter(d => d.terms.length).map(d => d.key).includes(facet);
            })
          })
        }

        // filter options
        const filterLabels = {
          "data.curated.keyword": "Curated Sequence",
          "data.virusSegment.keyword": "Virus Segment",
          "experimentDate.keyword": "Sample Date",
          "citation.name.keyword": "Source",
          "species.keyword": "Host",
          "country.identifier.keyword": "Country",
          "cohort.keyword": "Cohort",
          "infectionYear": "Infection Year",
          "outcome.keyword": "Outcome"
        };

        return ({
          total: exptData["total"],
          summary: summary,
          filteredSummary: filteredSummary,
          results: exptData
        })
      }),
      finalize(() => this.isLoadingSubject.next(false)),
      catchError(err => {
        console.log(`%c Error getting download list of experiments`, "color: orange")
        console.log(err)
        return from([]);
      })
    )
  }

  getExptFacets(id: string, patientFilter: string, exptFilter: string) {
    const exptFacets = ["data.curated", "data.virusSegment", "experimentDate", "citation.name"];

    let params = new HttpParams()
      .set('q', `includedInDataset.keyword:"${id}"`)
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
    let exptQuery = exptFilter ? `includedInDataset.keyword:"${id}"` : `includedInDataset.keyword:"${id}"`;

    let params = new HttpParams()
      .set('q', patientQuery)
      .set("experimentQuery", exptQuery)
      .set('facets', patientFacets.map(d => `${d}`).join(","))
      .set('facet_size', '1000')

    return this.apiSvc.get('patient', params, 0).pipe(
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

  getExptTable(id: string, patientFilter: string, exptFilter: string, size: number = 10) {
    let patientQuery = patientFilter ? patientFilter : "__all__";
    let exptQuery = exptFilter ? `includedInDataset.keyword:"${id}"` : `includedInDataset.keyword:"${id}"`;

    return this.getExpts4Table(patientQuery, exptQuery, size).pipe(
      mergeMap(expts => forkJoin(this.getPatients4Table(expts["hits"].map(d => d.experimentID)), this.getDownloads4Table(expts["hits"].map(d => d.experimentID))).pipe(
        map(([patients, dwnloads]) => {
          // Join together patients and expt data for the table.
          let merged = expts.hits.map(expt => {
            let pIdx = patients.findIndex(patient => patient.alternateIdentifier.includes(expt.privatePatientID))
            let dIdx = dwnloads.findIndex(download => download.experimentIDs.includes(expt.experimentID))
            if (pIdx > -1 && dIdx > -1) {
              return ({ ...expt, ...patients[pIdx], ...dwnloads[dIdx] })
            } else if (pIdx > -1) {
              return ({ ...expt, ...patients[pIdx] })
            } else if (dIdx > -1) {
              return ({ ...expt, ...dwnloads[dIdx] })
            }
            else {
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
    const exptFields = ["experimentID", "privatePatientID", "experimentDate", "dateModified", "data.DNAsequence"];
    let params = new HttpParams()
      .set('q', exptQuery)
      .set('fields', exptFields.join(","));

    if (patientQuery != "__all__") {
      params = params.set("patientQuery", patientQuery)
    }

    return this.apiSvc.get("experiment", params, size).pipe(
      map((expts: any) => {
        expts["hits"].forEach(d => {
          d["sequenceLength"] = d.data ? d.data.map(seq => seq.DNAsequence.length) : null;
        })
        return (expts)
      }),
      catchError(err => {
        console.log(`%c Error getting list of experiments for table`, "color: orange")
        console.log(err)
        return from([]);
      })
    )
  }

  getPatients4Table(exptIDs: string[]) {
    const patientFields = ["patientID", "alternateIdentifier", "cohort", "outcome", "country.name", "species", "infectionYear"];

    let params = new HttpParams()
      .set('q', "__all__")
      .set('experimentQuery', `experimentID:("${exptIDs.join('","')}")`)
      .set('fields', patientFields.join(","));

    return this.apiSvc.get("patient", params).pipe(
      pluck("hits"),
      map((patients: any) => {
        patients.forEach(d => {
          d["country"] = d.country.name;
        })
        return (patients)
      }),
      catchError(err => {
        console.log(`%c Error getting download list of patients`, "color: orange")
        console.log(err)
        return from([]);
      })
    )
  }

  getDownloads4Table(exptIDs: string[]) {
    const dwnldFields = ["name", "contentUrl", "additionalType", "experimentIDs"];

    let params = new HttpParams()
      .set('q', "__all__")
      .set('experimentQuery', `experimentID:("${exptIDs.join('","')}")`)
      .set('fields', dwnldFields.join(","));

    return this.apiSvc.get("datadownload", params).pipe(
      pluck("hits"),
      map((dwnlds: any) => {
        dwnlds.forEach(d => {
          d["file"] = d.name;
        })
        return (dwnlds)
      }),
      catchError(err => {
        console.log(`%c Error getting download list of downloads`, "color: orange")
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

  updateFacets(arr, summaryFacets, filters, key, variable) {
    let filterTerms = filters.flatMap(d => d["terms"].map(d => d.term));

    let keys = [... new Set(arr[key].concat(summaryFacets[variable]["terms"]).map(d => d.term))];

    let results = keys.map(target => {
      let filtered = summaryFacets[variable]["terms"].filter(facet => facet.term == target);
      let obj = { term: target };
      obj["count"] = filtered.length == 1 ? filtered[0].count : 0;
      obj["selected"] = filterTerms.includes(target);
      return(obj)
    });

    // sort by frequency
    results.sort((a:any, b:any) => b.count - a.count);

    return (results)
  }
}
