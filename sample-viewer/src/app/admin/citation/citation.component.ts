import { Component, OnInit } from '@angular/core';

import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { GetDatacatalogService } from '../../_services';

@Component({
  selector: 'app-citation',
  templateUrl: './citation.component.html',
  styleUrls: ['./citation.component.scss']
})
export class CitationComponent implements OnInit {
  currentYear: Date = new Date();
  cvisbCatalog: Object;

  constructor(
    private titleSvc: Title,
    private route: ActivatedRoute,
    private dataCatalogSvc: GetDatacatalogService
  ) {
    // set page title
    this.titleSvc.setTitle(this.route.snapshot.data.title);

    this.cvisbCatalog = this.dataCatalogSvc.cvisbCatalog;
  }

  ngOnInit() {
  }

}
