import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { AuthService } from '../_services';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Input() links: Object[];
  user: any;
  loggedIn: boolean;

  constructor(public authSvc: AuthService) {
    // call authentication service to check if logged in
    // Necessary to check on every page to reset authentication state if redirected.
    // authSvc.checkLogin();

    // authSvc.authState$.subscribe((loggedIn: boolean) => {
    //   console.log('Page loaded with authentication state: ' + loggedIn);
    // })

    authSvc.userState$.subscribe((user: Object) => {
      this.user = user;
      // console.log(this.user)
      this.loggedIn = Object.keys(this.user).length > 0  ? true : false;
      // console.log(this.loggedIn)
    })
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    // console.log("after view init");
    // this.authSvc.checkLogin();
  }

}
