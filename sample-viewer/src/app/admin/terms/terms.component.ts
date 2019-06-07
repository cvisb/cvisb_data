import { Component, OnInit } from '@angular/core';

import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.scss']
})
export class TermsComponent implements OnInit {
  updated_date: string = '2019-06-05';

  constructor(private titleSvc: Title, private route: ActivatedRoute) {
    // set page title
    this.titleSvc.setTitle(this.route.snapshot.data.title);
  }

  ngOnInit() {
  }

}
