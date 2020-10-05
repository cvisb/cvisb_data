import { Component, OnInit, OnDestroy } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
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
  total: Number;
  summary: any[];
  filters: any[];
  dataSubscription: Subscription;
  outcomeParams: string[] = [];
  locationParams: string[] = [];

  whichDataForm: FormGroup = this.fb.group({
    experiment: true,
    patient: true
  });

  constructor(
    private exptSvc: GetExperimentsService,
    private dwnldSvc: DownloadDataService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
    const params = this.route.snapshot.queryParams;
    console.log(params)
    this.id = this.route.snapshot.paramMap.get("id");
    this.outcomeParams = params.outcome ? params.outcome.split(";") : [];
    this.locationParams = params.location ? params.location.split(";") : [];

    this.dataSubscription = this.exptSvc.getDownloadList(this.id).subscribe(results => {
      console.log(results)
      this.total = results["total"];
      this.summary = results["filteredSummary"];
      this.filters = results["filters"];
    });
  }

  ngOnDestroy () {
    this.dataSubscription.unsubscribe();
  }

  changeRoute() {
    console.log("changingroute")
    this.router.navigate(["/download", this.id, {location: "test"}])
  }

  downloadData() {
    this.dwnldSvc.fetchDownload(this.id, this.whichDataForm.get("experiment"), this.whichDataForm.get("patient"))
  }

}
