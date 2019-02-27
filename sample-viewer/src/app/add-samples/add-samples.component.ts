import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-add-samples',
  templateUrl: './add-samples.component.html',
  styleUrls: ['./add-samples.component.scss']
})

export class AddSamplesComponent implements OnInit {


  constructor(
    private titleSvc: Title,
    private route: ActivatedRoute
  ) {
    this.titleSvc.setTitle(this.route.snapshot.data.title)
  }

  ngOnInit() {
  }

}
