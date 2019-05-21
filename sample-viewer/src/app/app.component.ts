import { Component, OnInit, PLATFORM_ID, Inject, AfterViewInit } from '@angular/core';
import { isPlatformBrowser, isPlatformServer, DOCUMENT } from '@angular/common';

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
    @Inject(DOCUMENT) private doc: any,
    @Inject(PLATFORM_ID) private platformId: Object,
    private angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics
  ) {

    angulartics2GoogleAnalytics.startTracking();
  }

  changeRoutes() {
  }


  ngOnInit() {
    this.authSvc.checkLogin();
    if (isPlatformServer(this.platformId)) {
      console.log('adding GA')
      this.setGTagManager();
      this.angulartics2GoogleAnalytics.startTracking();
    }
  }

  // <script async src="https://www.googletagmanager.com/gtag/js"></script>
  // <!-- <script>
  //   (function(i, s, o, g, r, a, m) {
  //     i['GoogleAnalyticsObject'] = r;
  //     i[r] = i[r] || function() {
  //       (i[r].q = i[r].q || []).push(arguments)
  //     }, i[r].l = 1 * new Date();
  //     a = s.createElement(o),
  //       m = s.getElementsByTagName(o)[0];
  //     a.async = 1;
  //     a.src = g;
  //     m.parentNode.insertBefore(a, m)
  //   })(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');
  //
  //   ga('create', 'UA-136260805-2', 'auto');
  // </script> -->

  private setGTagManager() {
    const s = this.doc.createElement('script');
    s.type = 'text/javascript';
    s.innerHTML = '  (function(i, s, o, g, r, a, m) { ' +
      "i['GoogleAnalyticsObject'] = r;" +
      'i[r] = i[r] || function() {' +
      '(i[r].q = i[r].q || []).push(arguments)' +
      '}, i[r].l = 1 * new Date();' +
      'a = s.createElement(o),' +
      'm = s.getElementsByTagName(o)[0];' +
      'a.async = 1;' +
      'a.src = g;' +
      'm.parentNode.insertBefore(a, m)' +
      "})(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');" +

      `ga('create', '${environment.GA_tracking}', 'auto');`
    const head = this.doc.getElementsByTagName('head')[0];
    head.appendChild(s);

    // this.angulartics2GoogleAnalytics.startTracking();
  }

  ngAfterViewInit() {
    this.angulartics2GoogleAnalytics.startTracking();
    // Only send GA if in client-side operations
  //   if (isPlatformBrowser(this.platformId)) {
  //   this.angulartics2GoogleAnalytics.startTracking();
  // } else {
  //   this.angulartics2GoogleAnalytics.startTracking();
  // }
    //   if (environment.production) {
    //     ga('create', 'UA-136260805-1', 'auto');
    //
    //   } else {
    //     ga('create', 'UA-136260805-2', 'auto');
    //   }

    // // Add in autotrack modules I want.
    // ga('require', 'eventTracker');
    // ga('require', 'outboundLinkTracker');
    // ga('require', 'urlChangeTracker');
    //
    // ga('send', 'pageview');
    // }
  }
}
