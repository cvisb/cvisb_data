import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { GetExperimentsService } from "../_services/get-experiments.service";
import { ExperimentObjectPipe } from "../_pipes/experiment-object.pipe";
import { DownloadDataService } from "../_services/download-data.service";
import { Subscription, Observable, pipe } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';

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
  iconID: string;
  datasetName: string;
  total: number;
  summary: any;
  unfilteredSummary: any;
  dataSource: MatTableDataSource<any>;
  pauseForm: Boolean = false;
  isLoading$: Observable<Boolean>;
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
    // { id: "file", label: "file" },
    { id: "dateModified", label: "date modified" }];
  displayedColumns: string[];

  dataSubscription: Subscription;

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
    private titleSvc: Title,
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

    // read params from route
    const params = this.route.snapshot.queryParams;
    this.id = this.route.snapshot.paramMap.get("id");

    // set initial checked boxes, based on the url
    let filterVals = {};

    this.filterKeys.forEach(key => {
      if (params[key] && params[key] != "") {
        let arr = params[key].split(",");
        filterVals[key] = arr.map(d => {
          return ({ selected: true, term: d, count: 0 })
        })
      } else {
        filterVals[key] = null;
      }
    });

    // set filter form values
    this.filterKeys.forEach(key => {
      if (filterVals[key]) {
        this.filterForm.setControl(key, this.fb.array(filterVals[key].map(option => this.fb.group(option)) || []));
      } else {
        this.filterForm.setControl(key, this.fb.array([]))
      }
    })

    let filtered = this.exptPipe.transform(this.id, 'dataset_id');
    this.datasetName = filtered['datasetName'];
    this.iconID = filtered['icon_id'];

    // Set page name
    this.titleSvc.setTitle(`Download ${this.datasetName} data`);

    // loading state
    this.isLoading$ = this.exptSvc.isLoadingState$;

    // Subscribe to initial data acquisition, create summary, table
    this.getData();
  }

  ngAfterViewInit() {
    // event listener for filters
    this.filterForm.valueChanges
      .pipe(
        filter(_ => !this.pauseForm)
      )
      .subscribe(filters => {
        // update the route
        let filterArr = Object.keys(filters).map(key => {
          let filtered = filters[key].filter(d => d.selected);
          return ({ key: key, value: filtered.map(d => d.term).join(",") })
        })

        let filterObj = filterArr.reduce((obj, item) => (obj[item.key] = item.value, obj), {});

        this.router.navigate(["/download", this.id], { queryParams: filterObj });

        // update the summary, etc.
          this.getData();
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

    this.dataSubscription = this.exptSvc.getDownloadData(this.id, this.unfilteredSummary, patientFilters).subscribe(results => {
      this.total = results["total"]; // total number of expts
      this.summary = results["filteredSummary"]; // graphical summary
      this.unfilteredSummary = results["summary"]; // graphical summary; constant results

      // table
      this.dataSource = new MatTableDataSource(results["results"]["hits"]);

      // filter options
      this.updateFilters(this.summary);
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
    this.pauseForm = true;

    this.filterKeys.forEach(key => {
      this.filterForm.setControl(key, this.fb.array(results[key].map(option => {
        return this.fb.group(option)
      }) || []));
    })

    this.pauseForm = false;
  }

  clearFilters() {
    this.router.navigate(["/download", this.id], { queryParams: {} });

    this.filterKeys.forEach(key => {
      let ctrl = this.filterForm.get(key) as FormArray;
      ctrl.clear();
    })

    this.getData();
  }

}
