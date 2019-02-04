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

    authSvc.authState$.subscribe((authState: AuthState) => {
      this.isLoggedIn = authState.loggedIn;
      this.isAuthorized = authState.authorized;
    })

  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    let url: string = state.url;

    return this.checkLogin(url);
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
