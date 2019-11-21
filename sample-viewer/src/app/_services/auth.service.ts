import { Injectable, Inject, PLATFORM_ID } from '@angular/core';

import { environment } from '../../environments/environment';
import { isPlatformBrowser } from '@angular/common';

import { BehaviorSubject } from 'rxjs';


import { MyHttpClient } from './http-cookies.service';
import { HttpHeaders } from "@angular/common/http";

import { DOCUMENT } from '@angular/common';

import { AuthState, CvisbUser } from '../_models';

// --- Terms dialog box ---
import { MatDialog, MatDialogRef } from '@angular/material';
import { TermsPopupComponent } from '../_dialogs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  logoutRedirect: string = `/home`;
  user: CvisbUser;
  termsDialogRef: MatDialogRef<any>;

  public userSubject: BehaviorSubject<CvisbUser> = new BehaviorSubject<CvisbUser>({});
  public userState$ = this.userSubject.asObservable();

  public termsAcceptedSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public termsAcceptedState$ = this.termsAcceptedSubject.asObservable();

  // store the URL so we can redirect after logging in
  redirectUrl: string;
  public redirectUrlSubject: BehaviorSubject<string> = new BehaviorSubject<string>('/');
  public redirectUrlState$ = this.redirectUrlSubject.asObservable();

  public authSubject: BehaviorSubject<AuthState> = new BehaviorSubject<AuthState>({ loggedIn: false, authorized: false });
  public authState$ = this.authSubject.asObservable();

  constructor(
    private myhttp: MyHttpClient,
    public dialog: MatDialog,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) private document: any
  ) {
    this.redirectUrlState$.subscribe(url => {
      this.redirectUrl = url;
    })

    if (isPlatformBrowser(this.platformId)) {
      // Read in whether terms have been accepted
      let termsAccepted = localStorage.getItem("terms-accepted");
      console.log("cookie value: " + termsAccepted)
      this.termsAcceptedSubject.next(Boolean(termsAccepted))

      this.termsAcceptedState$.subscribe(accepted => {
        console.log("term state within auth service:" + accepted)
        localStorage.setItem("terms-accepted", String(accepted));
      })
    }
  }

  login() {
    // Redirect to Google's servers to authenticate.
    // Then send to /redirect page to handle the redirect cascade.
    this.document.location.href = `${environment.api_url}/oauth?next=/redirect?next=${this.redirectUrl}`;
  }

  checkLogin(): Promise<void> {
    return new Promise<any>((resolve, _) => {
      // Call my Http client rather than http2, so the SSR properly gets called upon initial load.  Required to read stored cookie properly
      this.myhttp.get(environment.api_url + '/user', {
        observe: 'response',
        headers: new HttpHeaders()
          .set('Accept', 'application/json')
      }).subscribe((r) => {
        this.user = r.body;
        this.userSubject.next(this.user);

        let loginStatus: boolean = Object.keys(this.user).length > 0;
        let authStatus: boolean = this.user['read'];

        this.authSubject.next({ loggedIn: loginStatus, authorized: authStatus });

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
    this.user = null;
    this.authSubject.next({ loggedIn: false, authorized: false });
    this.redirectUrlSubject.next("/");
    this.userSubject.next({});

    this.document.location.href = `${environment.api_url}/logout?next=${this.logoutRedirect}`;
  }

  popupTerms() {
    console.log("calling popup terms")
    if (isPlatformBrowser(this.platformId)) {
      console.log('client-side')
      let accepted = this.termsAcceptedSubject.getValue();
      console.log("Current terms accepted value: " + accepted)
      if (!accepted) {
        console.log('popping up terms!')
        this.termsDialogRef = this.dialog.open(
          TermsPopupComponent, {
            width: '500px',
            disableClose: true
          });
      }

      if (this.termsDialogRef) {
        this.termsDialogRef.afterClosed().subscribe(result => {
          this.termsAcceptedSubject.next(result);
        })
      }
    }
  }

}
