import { Component, OnInit, OnDestroy } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../_services';

@Component({
  selector: 'app-redirect',
  templateUrl: './redirect.component.html',
  styleUrls: ['./redirect.component.scss']
})

export class RedirectComponent implements OnInit {
  page_url: string;
  urlSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authSvc: AuthService
  ) {

    this.urlSubscription = route.queryParams.subscribe(params => {
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

  ngOnDestroy() {
    this.urlSubscription.unsubscribe();
  }

}
