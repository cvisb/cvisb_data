import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { GetSamplesService, AuthService } from '../_services/';
import { Sample } from '../_models';

import * as d3 from 'd3';

@Component({
  selector: 'app-sample',
  templateUrl: './sample.component.html',
  styleUrls: ['./sample.component.scss']
})

export class SampleComponent implements OnInit {
  samples: Sample[];

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any) => {

      console.error(error); // log to console instead

    };
  }

  constructor(
    private sampleSvc: GetSamplesService,
    private route: ActivatedRoute,
    private authSvc: AuthService,
    private titleSvc: Title
  ) {
    // call authentication service to check if logged in
    // authSvc.checkLogin();

    // set page title
    this.titleSvc.setTitle(this.route.snapshot.data.title)

    // For downloading, save in the long form
    this.sampleSvc.samplesState$.subscribe((sList: Sample[]) => {
      this.samples = sList;
    })
  }


  ngOnInit() {
  }

}
