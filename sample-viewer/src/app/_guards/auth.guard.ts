import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivateChild } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthState } from '../_models';
import { AuthService } from '../_services';

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {
  isLoggedIn: boolean;
  isAuthorized: boolean;

  constructor(
    private authSvc: AuthService,
    private router: Router
  ) {
    authSvc.checkLogin();

    // authSvc.loginState$.subscribe((loggedIn: boolean) => {
    //   console.log("New login state received by auth.guard: " + loggedIn);
    //
    //   this.isLoggedIn = loggedIn;
    // })

    authSvc.authState$.subscribe((authState: AuthState) => {
      console.log("New authorization state received by auth.guard: ")
      console.log(authState);

      this.isLoggedIn = authState.loggedIn;
      this.isAuthorized = authState.authorized;
    })

  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    let url: string = state.url;

    console.log('calling auth guard: state = ' + this.isLoggedIn);
    console.log('url (auth guard) = ' + url)

    // return (true);
    return this.checkLogin(url);
    // return this.isLoggedIn;
  }

  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    return this.canActivate(route, state);
  }

  checkLogin(url: string): boolean {
    console.log('sending url --> service')
    // Store the attempted URL for redirecting
    this.authSvc.redirectUrlSubject.next(url);

    // if (this.isLoggedIn) {
    if (this.isLoggedIn && this.isAuthorized) {
      return true;
    }

    // Not logged in; navigate to login page
    if (!this.isLoggedIn) {
      this.router.navigate(['/login']);
      return false;
    }

    // Logged in but not authorized.
    this.router.navigate(['/unauthorized']);
    return false;
  }
}
