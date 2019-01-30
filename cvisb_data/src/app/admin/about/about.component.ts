import { Component, OnInit } from '@angular/core';

import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  constructor(private titleSvc: Title, private route: ActivatedRoute) {
    // set page title
    this.titleSvc.setTitle(this.route.snapshot.data.title);
  }

  ngOnInit() {
  }

}
