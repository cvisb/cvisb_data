import { Component, OnInit, OnDestroy } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { GetExperimentsService } from "../_services/get-experiments.service";
import { DownloadDataService } from "../_services/download-data.service";
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-download',
  templateUrl: './download.component.html',
  styleUrls: ['./download.component.scss']
})
export class DownloadComponent implements OnInit, OnDestroy {
  id: string;
  total: number;
  summary: any[];
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
    console.log(this.filterForm)
    console.log(this.filterKeys)

    let cohorts = this.filterForm.get("cohort") as FormArray;
    let outcomes = this.filterForm.get("outcome") as FormArray;
    let species = this.filterForm.get("species") as FormArray;
    let countries = this.filterForm.get("country") as FormArray;

    const params = this.route.snapshot.queryParams;
    this.id = this.route.snapshot.paramMap.get("id");
    this.outcomeParams = params.outcome ? params.outcome.split(";") : [];
    this.locationParams = params.location ? params.location.split(";") : [];

    this.dataSubscription = this.exptSvc.getDownloadList(this.id).subscribe(results => {
      console.log(results)
      this.total = results["total"];
      this.summary = results["filteredSummary"];

      results["filteredSummary"]["cohorts"].forEach((d, i:number) => {
        if(i < this.numFilters) {
        cohorts.push(this.fb.group(d))
        }
      })

      results["filteredSummary"]["outcomes"].forEach((d, i:number) => {
        if(i < this.numFilters) {
        outcomes.push(this.fb.group(d))
        }
      })

      results["filteredSummary"]["species"].forEach((d, i:number) => {
        if(i < this.numFilters) {
        species.push(this.fb.group(d))
        }
      })

      results["filteredSummary"]["countries"].forEach((d, i:number) => {
        if(i < this.numFilters) {
        countries.push(this.fb.group(d))
        }
      })

    });
  }

  ngOnDestroy() {
    this.dataSubscription.unsubscribe();
  }

  changeRoute() {
    console.log("changingroute")
    this.router.navigate(["/download", this.id, { location: "test" }])
  }

  downloadData() {
    console.log(this.filterForm.value)
    this.dwnldSvc.downloadExperiments(this.id, this.whichDataForm.get("experiment").value, this.whichDataForm.get("patient").value)
  }

}
