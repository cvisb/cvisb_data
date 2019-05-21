import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser, isPlatformServer, DOCUMENT } from '@angular/common';

import { AuthService } from './_services/auth.service';

import { environment } from '../environments/environment';

// Google Analytics autotrack for tracking sites on single page application.
// Added https://github.com/angulartics/angulartics2 instead of Google's autotrack (https://github.com/googleanalytics/autotrack)
// ... seemed more compatible with Angular Universal
// SSR --> webpack complains that the Autotrack doesn't contain document... and therefore fails to embed the tracking code, etc.
// Therefore, statically embed the GA 'create' script server-side on load (with different tracking IDs for dev/prod)
// and then use angulartics2 to trigger the SPA changes
import { Angulartics2GoogleAnalytics } from 'angulartics2/ga';

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
      this.setGTagManager();
    }
  }

  // Adapted from https://github.com/angular/angular-cli/issues/4451#issuecomment-384992203
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
  }
}
