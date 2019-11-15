import { Component, OnInit, Input } from '@angular/core';

import { Dataset } from '../../_models';
import { GetDatacatalogService } from '../../_services/';

@Component({
  selector: 'app-dataset-citation',
  templateUrl: './dataset-citation.component.html',
  styleUrls: ['./dataset-citation.component.scss']
})

export class DatasetCitationComponent implements OnInit {
  @Input() dataset: Dataset;
  cvisbCatalog: Object;

  constructor(private dataCatalogSvc: GetDatacatalogService) { }

  ngOnInit() {
    this.cvisbCatalog = this.dataCatalogSvc.cvisbCatalog;
  }

}
