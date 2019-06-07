import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.scss']
})

export class PrivacyComponent implements OnInit {
  updated_date = "2019-06-05";

  constructor(private titleSvc: Title, private route: ActivatedRoute) {
    // set page title
    this.titleSvc.setTitle(this.route.snapshot.data.title);
  }

  ngOnInit() {
  }

}
