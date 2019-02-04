import { Component, OnInit } from '@angular/core';

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
    private authSvc: AuthService,
  ) {
  }

  changeRoutes() {
  }


  ngOnInit() {
      this.authSvc.checkLogin();
  }
}
