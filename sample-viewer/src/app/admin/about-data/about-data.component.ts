import { Component, OnInit, OnDestroy } from '@angular/core';
import { GetDatacatalogService, AnchorService } from '../../_services';
import { ActivatedRoute } from '@angular/router';
import { Subscription, Observable } from 'rxjs';
import { DataCatalog } from '../../_models';

@Component({
  selector: 'app-about-data',
  templateUrl: './about-data.component.html',
  styleUrls: ['./about-data.component.scss']
})

export class AboutDataComponent implements OnInit, OnDestroy {
  cvisbCatalog$: Observable<DataCatalog>;
  routeSubscription: Subscription;

  constructor(private dataCatalogSvc: GetDatacatalogService,
    private route: ActivatedRoute,
    private anchorSvc: AnchorService
  ) {

    // get static data catalog params
    this.cvisbCatalog$ = this.dataCatalogSvc.dataCatalog$;
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
