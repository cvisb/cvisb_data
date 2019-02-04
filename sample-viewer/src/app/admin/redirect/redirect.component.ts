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

    console.log("REDIRECT PAGE CONSTRUCTED")

    route.queryParams.subscribe(params => {
      console.log(params);
      console.log("redirect sees next page = " + params['next']);
      this.page_url = params['next']
    })

  }

  ngOnInit() {
    this.authSvc.checkLogin().then(result => {
      console.log('Auth service has completed. Then is returning a status of: ' + result)

      console.log("Redirect is trying to redirect to " + this.page_url)
      if (this.page_url) {
        this.router.navigate([this.page_url])
      }
    })

  }

}
