import { Component, OnInit } from '@angular/core';

import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { GetDatacatalogService, getDatasetsService } from '../../_services';

import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-citation',
  templateUrl: './citation.component.html',
  styleUrls: ['./citation.component.scss']
})

export class CitationComponent implements OnInit {
  currentYear: Date = new Date();
  cvisbCatalog: Object;
  host_url: string = environment.host_url;

  patients = {
    sources: [
      {
        type: "publisher",
        "contactPoint": {
          "@type": "ContactPoint",
          "contactType": "technical support",
          "email": "info@cvisb.org",
          "url": "https://cvisb.org/"
        },
        "name": "Center for Viral Systems Biology",
        "url": "https://cvisb.org/"
      }]
  }

  experiments: Object[];

  constructor(
    private titleSvc: Title,
    private route: ActivatedRoute,
    private dataCatalogSvc: GetDatacatalogService,
    private datasetSvc: getDatasetsService
  ) {
    // set page title
    this.titleSvc.setTitle(this.route.snapshot.data.title);

    this.cvisbCatalog = this.dataCatalogSvc.cvisbCatalog;
  }

  ngOnInit() {
    this.datasetSvc.getDatasetSources("experiment").subscribe(sources => {
      this.experiments = sources;
    });
    // this.datasetSvc.getDatasetSources("patient").subscribe(sources => {
    //   console.log(sources)
    // });
  }

}
