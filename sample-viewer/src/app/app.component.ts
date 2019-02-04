import { Component, Renderer2, Inject, OnInit, PLATFORM_ID, AfterViewChecked, AfterViewInit } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';

// import { MyHttpClient } from './_services/auth-helper.service';

// import { Router, NavigationStart, NavigationEnd, GuardsCheckEnd } from '@angular/router';
// import { environment } from '../environments/environment';


// import { Observable, of } from 'rxjs';
// import { Observable, Subject, BehaviorSubject } from 'rxjs';
// import { HttpClient, HttpErrorResponse, HttpEventType, HttpHeaders, HttpParams, HttpRequest, HttpResponse } from "@angular/common/http";

// import { isPlatformServer, isPlatformBrowser } from '@angular/common';

import { AuthService } from './_services/auth.service';

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
    { 'path': 'sample/upload', 'label': 'add samples', 'selected': false },
    { 'path': 'schema', 'label': 'schema', 'selected': false },
    // {'path': 'export', 'label': 'export sample list', 'selected': false },
    // { 'path': 'login', 'label': 'login', 'selected': false }
  ]

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private authSvc: AuthService,
    // private router: Router,
    // private http: MyHttpClient
    // private renderer: Renderer2,
    // @Inject(DOCUMENT) private _document,
  ) {
    // console.log('constructing')
    // this.authSvc.checkLogin();
    // router.events.subscribe((event) => {
    //   // console.log(event)
    //   // console.log(this._document.querySelectorAll('[title="schemaorg"]'))
    //   // console.log(this._document.getElementById("schemaorg"))
    //   if (event instanceof GuardsCheckEnd) {
    //     // console.log('nav starting')
    //     // On page re-route, delete any previously declared custom added json-ld scripts
    //
    //     if (this._document.querySelectorAll('[title="schemaorg"]')) {
    //       // console.log('should remove element')
    //       // console.log(this.renderer.selectRootElement('schemaorg') == true)
    //       // this.renderer.removeChild(this._document.body, this.renderer.selectRootElement(`schemaorg`));
    //     }
    //   }
    // });
  }

  // checkLoginGH() {
  //   // console.log('auth.service called to check logged in state')
  //   this.http.get(environment.api_url + '/user', {
  //     observe: 'response',
  //     headers: new HttpHeaders()
  //       .set('Accept', 'application/json')
  //   }).subscribe((r) => {
  //     // console.log(r)
  //     console.log('CALLED FROM AUTH HELPER:')
  //     console.log(r.body)
  //   },
  //     err => {
  //       console.log(err)
  //     })
  // }


  changeRoutes() {
    console.log("route changed triggered")
    // console.log("ROUTE CHANGED; calling auth service")
    // this.authSvc.checkLogin();
    // this.checkLoginGH();
  }

  ngAfterViewChecked() {
    // console.log('after view checked; calling auth')
    // this.authSvc.checkLogin();
  }

  ngAfterViewInit() {
    // console.log('after view init; calling auth')
    // this.authSvc.checkLogin();
  }

  ngOnInit() {
    // if (isPlatformServer(this.platformId)) {
    //   console.log('client-side')
      this.authSvc.checkLogin();
    // }

    // else {

      // console.log('server-side')
      // this.authSvc.checkLogin();
    // }
  }
}
