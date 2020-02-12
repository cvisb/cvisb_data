import { Component, OnInit } from '@angular/core';

import { GetDatacatalogService } from '../../_services';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-release-notes',
  templateUrl: './release-notes.component.html',
  styleUrls: ['./release-notes.component.scss']
})

export class ReleaseNotesComponent implements OnInit {
  cvisbCatalog$: Observable<Object>;

  constructor(private dataCatalogSvc: GetDatacatalogService) {
    this.cvisbCatalog$ = this.dataCatalogSvc.dataCatalog$;;
  }

  ngOnInit() {
  }

}
