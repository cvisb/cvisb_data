import { Component, OnInit } from '@angular/core';

import { GetDatacatalogService } from '../../_services';
import { ReleaseNote } from '../../_models';

@Component({
  selector: 'app-release-notes',
  templateUrl: './release-notes.component.html',
  styleUrls: ['./release-notes.component.scss']
})

export class ReleaseNotesComponent implements OnInit {
  dataModified: string;
  releaseVersion: string;
  cvisbCatalog: Object;
  releaseNotes: ReleaseNote[];

  constructor(private dataCatalogSvc: GetDatacatalogService) {
    this.dataModified = this.dataCatalogSvc.dataModified;
    this.cvisbCatalog = this.dataCatalogSvc.cvisbCatalog;
    if (this.cvisbCatalog) {
      this.releaseVersion = this.cvisbCatalog['releaseVersion'];
      this.releaseNotes = this.cvisbCatalog['releaseNotes'];
    }
  }

  ngOnInit() {
  }

}
