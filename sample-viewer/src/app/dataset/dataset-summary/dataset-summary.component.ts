import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-dataset-summary',
  templateUrl: './dataset-summary.component.html',
  styleUrls: ['./dataset-summary.component.scss']
})
export class DatasetSummaryComponent implements OnInit {
  @Input() dataset: any;

  constructor() { }

  ngOnInit() {
    console.log(this.dataset)
  }

}
