import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { GetExperimentsService } from "../_services/get-experiments.service";
import { ExperimentObjectPipe } from "../_pipes/experiment-object.pipe";
import { DownloadDataService } from "../_services/download-data.service";
import { Subscription } from 'rxjs';

import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';


@Component({
  selector: 'app-download',
  templateUrl: './download.component.html',
  styleUrls: ['./download.component.scss']
})

export class DownloadComponent implements OnInit, OnDestroy {
  id: string;
  datasetName: string;
  total: number;
  summary: any;
  dataSource: MatTableDataSource<any>;
  isFirstCall: Boolean = true;
  columns: Object[] = [
    { id: "experimentID", label: "experiment ID" },
    { id: "patientID", label: "patient ID" },
    { id: "species", label: "host" },
    { id: "cohort", label: "cohort" },
    { id: "outcome", label: "outcome" },
    { id: "country", label: "country" },
    { id: "infectionYear", label: "infection year" },
    { id: "sequenceLength", label: "sequence length" },
    { id: "experimentDate", label: "experiment date" },
    { id: "file", label: "file" },
    { id: "dateModified", label: "date modified" }];
  displayedColumns: string[];

  dataSubscription: Subscription;
  outcomeParams: string[] = [];
  locationParams: string[] = [];

  whichDataForm: FormGroup = this.fb.group({
    experiment: true,
    patient: true
  });

  filterForm: FormGroup;
  filterKeys: string[] = [];
  numFilters: Number = 5;

  constructor(
    private exptSvc: GetExperimentsService,
    private dwnldSvc: DownloadDataService,
    private exptPipe: ExperimentObjectPipe,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute) {
    this.filterForm = this.fb.group({
      cohort: this.fb.array([]),
      outcome: this.fb.array([]),
      species: this.fb.array([]),
      country: this.fb.array([])
    })

    this.filterKeys = Object.keys(this.filterForm.controls);
  }

  ngOnInit() {
    this.displayedColumns = this.columns.map(d => d["id"]);

    const params = this.route.snapshot.queryParams;
    this.id = this.route.snapshot.paramMap.get("id");
    let filtered = this.exptPipe.transform(this.id, 'dataset_id');
    this.datasetName = filtered['datasetName'];

    this.outcomeParams = params.outcome ? params.outcome.split(";") : [];
    this.locationParams = params.location ? params.location.split(";") : [];

    // Subscribe to initial data acquisition, create summary, table
    this.getData();
  }

  ngAfterViewInit() {
    console.log("setting first call to FALSE")
    // this.isFirstCall = false;

    // event listener for filters
    this.filterForm.valueChanges.subscribe(filters => {
      console.log("FILTER CHANGED")
      console.log(filters)
      // update the route
      let filterArr = Object.keys(filters).map(key => {
        let filtered = filters[key].filter(d => d.selected);
        return ({ key: key, value: filtered.map(d => d.term).join(",") })
      })

      let filterStr = filterArr.reduce((obj, item) => (obj[item.key] = item.value, obj), {});
      this.router.navigate(["/download", this.id, filterStr]);

      // update the summary, etc.
      if (!this.isFirstCall) {
        console.log("update summary")
        this.getData()
      } else {
        // initial loading of the data
        console.log("NO update summary")
        // this.isFirstCall = false;
      }
    })
  }

  ngOnDestroy() {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }

  getData() {
    let patientFilters = Object.keys(this.filterForm.value).map(key => {
      return ({
        key: key,
        terms: this.filterForm.value[key].filter(d => d.selected)
      })
    })

    let patientQueryArr = patientFilters.filter(d => d.terms.length).map(facet => `${facet.key}:("${facet.terms.map(x => x.term).join('" OR "')}")`);
    let patientQuery = patientQueryArr.join(" AND ");
    console.log(patientQuery)

    this.dataSubscription = this.exptSvc.getDownloadData(this.id, patientQuery).subscribe(results => {
      console.log("results!!!!")
      console.log(results)
      this.total = results["total"]; // total number of expts
      console.log(this.total)
      this.summary = results["filteredSummary"]; // graphical summary

      // table
      this.dataSource = new MatTableDataSource(results["results"]["hits"]);

      // filter options
      this.updateFilters(results);
      this.isFirstCall = false;
    });
  }

  downloadData() {
    let filters = Object.keys(this.filterForm.value).map(key => {
      return ({
        key: key,
        terms: this.filterForm.value[key].filter(d => d.selected)
      })
    })

    this.dwnldSvc.downloadExperiments(this.id, this.whichDataForm.get("experiment").value, this.whichDataForm.get("patient").value, filters)
  }

  updateFilters(results) {
    console.log("UPDATING FILTERS")
    let cohorts = this.filterForm.get("cohort") as FormArray;
    let outcomes = this.filterForm.get("outcome") as FormArray;
    let species = this.filterForm.get("species") as FormArray;
    let countries = this.filterForm.get("country") as FormArray;

    // reset all forms
    cohorts.clear();
    outcomes.clear();
    species.clear();
    countries.clear();

    results["filteredSummary"]["cohorts"].forEach((d, i: number) => {
      if (i < this.numFilters) {
        cohorts.push(this.fb.group(d))
      }
    })

    results["filteredSummary"]["outcomes"].forEach((d, i: number) => {
      if (i < this.numFilters) {
        outcomes.push(this.fb.group(d))
      }
    })

    results["filteredSummary"]["species"].forEach((d, i: number) => {
      if (i < this.numFilters) {
        species.push(this.fb.group(d))
      }
    })

    results["filteredSummary"]["countries"].forEach((d, i: number) => {
      if (i < this.numFilters) {
        countries.push(this.fb.group(d))
      }
    })
  }

}
