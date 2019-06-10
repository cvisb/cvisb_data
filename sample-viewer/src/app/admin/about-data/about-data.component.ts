import { Component, OnInit } from '@angular/core';
import { GetDatacatalogService } from '../../_services';

@Component({
  selector: 'app-about-data',
  templateUrl: './about-data.component.html',
  styleUrls: ['./about-data.component.scss']
})

export class AboutDataComponent implements OnInit {
  dataModified: string;
  releaseVersion: string;
  cvisbCatalog: Object;

  constructor(private dataCatalogSvc: GetDatacatalogService) {
    this.dataModified = this.dataCatalogSvc.dataModified;
    this.cvisbCatalog = this.dataCatalogSvc.cvisbCatalog;
    if (this.cvisbCatalog) {
      this.releaseVersion = this.cvisbCatalog['releaseVersion'];
    }
  }

  ngOnInit() {
  }

}
