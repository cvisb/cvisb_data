import { Injectable, OnDestroy } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { AuthState } from '../_models';
import { AuthService } from '../_services';

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {
  isLoggedIn: boolean;
  isAuthorized: boolean;

  authSubsciption: Subscription;

  constructor(
    private authSvc: AuthService,
    private router: Router
  ) {
    authSvc.checkLogin();

    this.authSubsciption = authSvc.authState$.subscribe((authState: AuthState) => {
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

  OnDestroy() {
    this.authSubsciption.unsubscribe();
  }

  checkLogin(url: string): boolean {
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
