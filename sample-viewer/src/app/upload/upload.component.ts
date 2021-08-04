import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {

  links: Object[] = [
    { label: "samples", path: "sample" },
    { label: "dataset", path: "dataset" },
    { label: "patients", path: "patient" },
    { label: "catalog", path: "catalog" },
    { label: "delete", path: "delete" }
  ]

  constructor(
    private titleSvc: Title,
    private route: ActivatedRoute
  ) {
    this.titleSvc.setTitle(this.route.snapshot.data.title)
  }

  ngOnInit() {
  }

}
