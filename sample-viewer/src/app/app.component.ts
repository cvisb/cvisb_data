import { Component, OnInit, PLATFORM_ID, Inject, AfterViewInit } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { AuthService } from './_services/auth.service';

import { environment } from '../environments/environment';

import { Angulartics2GoogleAnalytics } from 'angulartics2/ga';

// Google Analytics autotrack for tracking sites on single page application.
// https://github.com/googleanalytics/autotrack#installation-and-usage
// `npm install autotrack` --> not necessary on servers, since package.json updated. Did have to run an `npm install`
// `npm install --save-dev @types/google.analytics` --> `ga` works as a function.


declare let ga: Function;


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'sample-viewer';

  links: Object[] = [
    { 'path': 'home', 'label': 'home', 'selected': true },
    { 'path': 'dataset', 'label': 'data', 'selected': false },
    { 'path': 'patient', 'label': 'patients', 'selected': false },
    { 'path': 'sample', 'label': 'samples', 'selected': false },
    { 'path': 'upload', 'label': 'upload', 'selected': false },
    { 'path': 'documentation', 'label': 'documentation', 'selected': false },
  ]

  constructor(
    private authSvc: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object,
    angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics
  ) {

    angulartics2GoogleAnalytics.startTracking();
  }

  changeRoutes() {
  }


  ngOnInit() {
    this.authSvc.checkLogin();
  }

  ngAfterViewInit() {
    // Only send GA if in client-side operations
    if (isPlatformBrowser(this.platformId)) {
      if (environment.production) {
        ga('create', 'UA-136260805-1', 'auto');

      } else {
        ga('create', 'UA-136260805-2', 'auto');
      }

      // // Add in autotrack modules I want.
      // ga('require', 'eventTracker');
      // ga('require', 'outboundLinkTracker');
      // ga('require', 'urlChangeTracker');
      //
      // ga('send', 'pageview');
    }
  }
}
