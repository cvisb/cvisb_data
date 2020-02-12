import { Component, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { Subscription } from 'rxjs';
import { AuthService } from '../../_services';
import { AuthState } from '../../_models';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnDestroy {

  message: string;
  page: string;
  loggedIn: boolean;
  prodEnvironment: boolean;
  user: Object;
  redirectSubscription: Subscription;
  authSubscription: Subscription;
  userSubscription: Subscription;

  constructor(
    public authSvc: AuthService,
    private titleSvc: Title,
    private route: ActivatedRoute,
    public router: Router) {
    this.prodEnvironment = environment.production;

    this.redirectSubscription = this.authSvc.redirectUrlState$.subscribe((url: string) => {
      this.page = url;
    });

    this.userSubscription = authSvc.userState$.subscribe((user: Object) => {
      this.user = user;
    })

    this.authSubscription = authSvc.authState$.subscribe((authState: AuthState) => {
      this.loggedIn = authState.loggedIn;
    })

    // set page title
    this.titleSvc.setTitle(this.route.snapshot.data.title);

    // call authentication service to check if logged in
    // authSvc.checkLogin();
  }


  login() {
    this.message = 'Trying to log in ...';

    this.authSvc.login();
    this.message = null;
  }

  logout() {
    this.authSvc.logout();
  }

  ngOnDestroy() {
    this.redirectSubscription.unsubscribe();
    this.userSubscription.unsubscribe();
    this.authSubscription.unsubscribe();
  }

}
