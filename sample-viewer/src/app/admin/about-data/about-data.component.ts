import { Component, OnInit, OnDestroy } from '@angular/core';
import { GetDatacatalogService, AnchorService } from '../../_services';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-about-data',
  templateUrl: './about-data.component.html',
  styleUrls: ['./about-data.component.scss']
})

export class AboutDataComponent implements OnInit {
  dataModified: string;
  releaseVersion: string;
  cvisbCatalog: Object;
  routeSubscription: Subscription;

  constructor(private dataCatalogSvc: GetDatacatalogService,
    private route: ActivatedRoute,
    private anchorSvc: AnchorService
  ) {

    // get static data catalog params
    this.dataModified = this.dataCatalogSvc.dataModified;
    this.cvisbCatalog = this.dataCatalogSvc.cvisbCatalog;
    if (this.cvisbCatalog) {
      this.releaseVersion = this.cvisbCatalog['releaseVersion'];
    }
  }

  ngOnInit() {
    // # anchor tag handling
    this.routeSubscription = this.route.fragment.subscribe((anchor_tag) => {
      this.anchorSvc.clickAnchor(anchor_tag);
    })
  }

  ngOnDestroy() {
    this.routeSubscription.unsubscribe();
  }

}
