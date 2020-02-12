import { Component, OnInit } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { AuthService } from '../../_services';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-unauthorized',
  templateUrl: './unauthorized.component.html',
  styleUrls: ['./unauthorized.component.scss']
})
export class UnauthorizedComponent implements OnInit {
  page$: Observable<string>;

  constructor(
    private titleSvc: Title,
    private route: ActivatedRoute,
    private authSvc: AuthService
  ) {

    // set page title
    this.titleSvc.setTitle(this.route.snapshot.data.title);

    this.page$ = authSvc.redirectUrlState$;
  }

  ngOnInit() {
  }

}
