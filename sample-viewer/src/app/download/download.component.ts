import { Component, OnInit, OnDestroy } from '@angular/core';

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

    let cohorts = this.filterForm.get("cohort") as FormArray;
    let outcomes = this.filterForm.get("outcome") as FormArray;
    let species = this.filterForm.get("species") as FormArray;
    let countries = this.filterForm.get("country") as FormArray;

    const params = this.route.snapshot.queryParams;
    this.id = this.route.snapshot.paramMap.get("id");
    let filtered = this.exptPipe.transform(this.id, 'dataset_id');
    this.datasetName = filtered['datasetName'];

    this.outcomeParams = params.outcome ? params.outcome.split(";") : [];
    this.locationParams = params.location ? params.location.split(";") : [];

    // Subscribe to initial data acquisition, create summary, table
    this.dataSubscription = this.exptSvc.getDownloadData(this.id).subscribe(results => {
      console.log("results!!!!")
      console.log(results)
      this.total = results["total"]; // total number of expts
      this.summary = results["filteredSummary"]; // graphical summary

      // table
      this.dataSource = new MatTableDataSource(results["results"]["hits"]);

      // filter options
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
    });

    // event listener for filters
    this.filterForm.valueChanges.subscribe(filters => {
      console.log("FILTER CHANGED")
      console.log(filters)
    })
  }

  ngOnDestroy() {
    this.dataSubscription.unsubscribe();
  }

  changeRoute() {
    console.log("changingroute")
    this.router.navigate(["/download", this.id, { location: "test" }])
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

}
