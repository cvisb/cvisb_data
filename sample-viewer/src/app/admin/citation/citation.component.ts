import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';

import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { GetDatacatalogService, getDatasetsService } from '../../_services';

import { isPlatformBrowser } from '@angular/common';

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
        "name": "Viral Hemorrhagic Fever Consortium / Kenema Government Hospital",
        "url": "https://vhfc.org/"
      }]
  }

  experiments: Object[];

  constructor(
    private titleSvc: Title,
    private route: ActivatedRoute,
    private dataCatalogSvc: GetDatacatalogService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private datasetSvc: getDatasetsService
  ) {
    // set page title
    this.titleSvc.setTitle(this.route.snapshot.data.title);

    this.cvisbCatalog = this.dataCatalogSvc.cvisbCatalog;
  }

  ngOnInit() {
    // this.datasetSvc.getAllSources().subscribe(sources => {
    //   console.log(sources)
    //   // this.experiments = sources.dataset;
    // })
    if (isPlatformBrowser(this.platformId)) {
      this.datasetSvc.getDatasetSources().subscribe(sources => {
        this.experiments = sources;
        // console.log(sources)
      });

      this.datasetSvc.getPatientSources().subscribe(sources => {
        console.log(sources)
      });
    }
  }

}
