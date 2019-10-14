import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-dataset-summary',
  templateUrl: './dataset-summary.component.html',
  styleUrls: ['./dataset-summary.component.scss']
})
export class DatasetSummaryComponent implements OnInit {
  @Input() dataset: any;
  all_cohorts = ["Lassa", "Unknown"];
  all_outcomes = ["survivor", "dead"];
  all_files =  ["raw data",  "curated data"];
  files =  [{term: "raw data", count: 100}, {term: "curated data", count: 1}];
  viruses =  [{term: "Unknown", count: 9999}];
  outcomes =  [{term: "survivor", count: 100}, {term: "dead", count: 20}];
  years =  [{term: 2012, count: 100}, {term: 2013, count: 20}, {term: 2014, count: 20}, {term: 2015, count: 20}];
  yearDomain=[2012, 2013, 2014, 2015]

  data1 = [
    { identifier: 'NG', name: "Nigeria", count: 486 },
    { identifier: 'SL', name: "Sierra Leone", count: 88 },
    { identifier: 'LR', name: "Liberia", count: 22 },
    { identifier: 'GN', name: "Guinea", count: 9 },
    { identifier: 'ML', name: "Mali", count: 3 },
    { identifier: 'TG', name: "Togo", count: 1 },
  ];

  constructor() { }

  ngOnInit() {
  }

}
