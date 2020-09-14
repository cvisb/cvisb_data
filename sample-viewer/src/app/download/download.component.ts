import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { GetExperimentsService } from "../_services/get-experiments.service";

@Component({
  selector: 'app-download',
  templateUrl: './download.component.html',
  styleUrls: ['./download.component.scss']
})
export class DownloadComponent implements OnInit {
  id: String;
  total: Number;
  outcomeParams: string[] = [];
  locationParams: string[] = [];

  whichDataForm: FormGroup = this.fb.group({
    experiment: true,
    patient: true
  });

  constructor(
    private exptSvc: GetExperimentsService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
    const params = this.route.snapshot.queryParams;
    console.log(params)
    this.id = this.route.snapshot.paramMap.get("id");
    console.log(this.route.snapshot.paramMap)
    this.outcomeParams = params.outcome ? params.outcome.split(";") : [];
    this.locationParams = params.location ? params.location.split(";") : [];

    console.log(this.outcomeParams)
    console.log(this.locationParams)
    this.exptSvc.getDownloadList(this.id).subscribe(results => {
      console.log(results)
      this.total = results["total"];
    });
  }

  changeRoute() {
    console.log("changingroute")
    this.router.navigate(["/download", this.id, {location: "test"}])


  }

}
