import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-dataset-summary',
  templateUrl: './dataset-summary.component.html',
  styleUrls: ['./dataset-summary.component.scss']
})
export class DatasetSummaryComponent implements OnInit {
  @Input() dataset: any;
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
