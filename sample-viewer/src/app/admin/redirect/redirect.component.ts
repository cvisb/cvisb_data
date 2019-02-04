import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '../../_services';

@Component({
  selector: 'app-redirect',
  templateUrl: './redirect.component.html',
  styleUrls: ['./redirect.component.scss']
})

export class RedirectComponent implements OnInit {
  page_url: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authSvc: AuthService
  ) {

    route.queryParams.subscribe(params => {
      this.page_url = params['next']
    })

  }

  ngOnInit() {
    this.authSvc.checkLogin().then(result => {
      if (this.page_url) {
        this.router.navigate([this.page_url])
      }
    })

  }

}
