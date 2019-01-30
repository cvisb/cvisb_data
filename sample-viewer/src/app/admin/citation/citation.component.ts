import { Component, OnInit } from '@angular/core';

import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-citation',
  templateUrl: './citation.component.html',
  styleUrls: ['./citation.component.scss']
})
export class CitationComponent implements OnInit {
  currentYear: Date = new Date();

  constructor(private titleSvc: Title, private route: ActivatedRoute) {
    // set page title
    this.titleSvc.setTitle(this.route.snapshot.data.title);
  }

  ngOnInit() {
  }

}
