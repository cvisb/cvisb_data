import { Injectable, Inject } from '@angular/core';

import { environment } from '../../environments/environment';


// import { Observable, of } from 'rxjs';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { tap, delay } from 'rxjs/operators';

import { Router } from '@angular/router';

import { MyHttpClient } from './auth-helper.service';
import { HttpClient, HttpErrorResponse, HttpEventType, HttpHeaders, HttpParams, HttpRequest, HttpResponse } from "@angular/common/http";

import { DOCUMENT } from '@angular/common';

import { AuthState } from '../_models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  logoutRedirect: string = `/home`;
  // logoutRedirect: string = `${environment.host_url}/login`;
  user: Object;
  authorizedUsers = ['laura.d.hughes@gmail.com', 'andrew.su@gmail.com'];

  public userSubject: BehaviorSubject<Object> = new BehaviorSubject<Object>({});
  public userState$ = this.userSubject.asObservable();


  // store the URL so we can redirect after logging in
  redirectUrl: string;
  public redirectUrlSubject: BehaviorSubject<string> = new BehaviorSubject<string>('/');
  public redirectUrlState$ = this.redirectUrlSubject.asObservable();

  public authSubject: BehaviorSubject<AuthState> = new BehaviorSubject<AuthState>({loggedIn: false, authorized: false});
  public authState$ = this.authSubject.asObservable();

  constructor(
    private http2: HttpClient,
    private myhttp: MyHttpClient,
    private router: Router,
    @Inject(DOCUMENT) private document: any
  ) {

    this.redirectUrlState$.subscribe(url => {
      console.log('auth.service received URL: ' + url)
      this.redirectUrl = url;
    })
  }

  // login(): Observable<boolean> {
  //   if (!this.isLoggedIn) {
  //     return of(true).pipe(
  //       delay(1000),
  //       tap(val => this.isLoggedIn = true)
  //     );
  //   }
  // }
  login() {
    console.log('starting login within service')
    console.log('setting up redirect page')
    console.log('redirecting to ' + this.redirectUrl)


    // if (!this.redirectUrl) {
    //   this.redirectUrl = '/';
    // }

    // temp: pause before redirecting.
    function sleep(miliseconds) {
      var currentTime = new Date().getTime();

      while (currentTime + miliseconds >= new Date().getTime()) {
      }
    }

    sleep(2000)

    // Redirect to Google's servers to authenticate.
    // Then send to /redirect page to handle the redirect cascade.
    this.document.location.href = `${environment.api_url}/oauth?next=/redirect?next=${this.redirectUrl}`;
    // this.document.location.href = `${environment.api_url}/oauth?next=${this.redirectUrl}`;
    // this.checkLogin();
    // console.log('finished logging in.')
  }

  checkLogin(): Promise<void> {
    return new Promise<any>((resolve, reject) => {
      // console.log('auth.service called to check logged in state')
      this.myhttp.get(environment.api_url + '/user', {
        // this.http2.get(environment.api_url + '/user', {
        observe: 'response',
        headers: new HttpHeaders()
          .set('Accept', 'application/json')
      }).subscribe((r) => {
        // console.log(r)
        console.log('auth.service returns with user:')
        console.log(r.body)
        this.user = r.body;
        this.userSubject.next(this.user);

        let loginStatus: boolean = Object.keys(this.user).length > 0;
        let authStatus: boolean = this.authorizedUsers.indexOf(this.user['email']) > 0;

        console.log('loginStatus: ' + loginStatus)
        console.log('authStatus:' + authStatus)

        this.authSubject.next({loggedIn: loginStatus, authorized: authStatus});

        resolve("Login has been checked!");
        // Object.keys(this.user).length > 0 ? this.isLoggedIn = true : this.isLoggedIn = false;
      },
        err => {
          console.log(err)
          resolve("Login failed!");
        })
    })
  }

  logout(): void {
    // this.isLoggedIn = false;
    this.user = null;
    this.authSubject.next({loggedIn: false, authorized: false});
    this.redirectUrlSubject.next("/");
    this.userSubject.next({});

    this.document.location.href = `${environment.api_url}/logout?next=${this.logoutRedirect}`;
  }

}
