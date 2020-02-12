import { Component, Input, OnDestroy } from '@angular/core';
import { AuthService } from '../_services';
import { Subscription } from 'rxjs';

import { environment } from '../../environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnDestroy {

  @Input() links: Object[];
  user: any;
  loggedIn: boolean;
  authorized: boolean;
  prodEnvironment: boolean;
  authSubscription: Subscription;

  constructor(public authSvc: AuthService) {
    // call authentication service to check if logged in
    // Necessary to check on every page to reset authentication state if redirected.
    // authSvc.checkLogin();

    // authSvc.loginState$.subscribe((loggedIn: boolean) => {
    //   console.log('Page loaded with authentication state: ' + loggedIn);
    // })

    this.authSubscription = authSvc.userState$.subscribe((user: Object) => {
      this.user = user;
      this.loggedIn = Object.keys(this.user).length > 0 ? true : false;
      this.authorized = user['read'];
    })

    this.prodEnvironment = environment.production;
  }

  ngOnDestroy() {
    this.authSubscription.unsubscribe();
  }

  login() {
    this.authSvc.login();
  }

}
