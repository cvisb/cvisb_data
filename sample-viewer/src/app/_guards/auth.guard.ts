import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivateChild } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService } from '../_services';

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {
  isLoggedIn: boolean;

  constructor(
    private authSvc: AuthService,
    private router: Router
  ) {
    authSvc.checkLogin();

    authSvc.authState$.subscribe((loggedIn: boolean) => {
      console.log("New login state received by auth.guard: " + loggedIn);

      this.isLoggedIn = loggedIn;
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
    this.authSvc.redirectUrlSubject.next(url);

    if (this.isLoggedIn) {
      return true;
    }

    // this.authService.checkLogin();

    // Store the attempted URL for redirecting
    // this.authService.redirectUrl = url;

    // Navigate to the login page with extras
    this.router.navigate(['/login']);
    return false;
  }
}
