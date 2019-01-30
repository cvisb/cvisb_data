import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-filter-file-type',
  templateUrl: './filter-file-type.component.html',
  styleUrls: ['./filter-file-type.component.scss']
})
export class FilterFileTypeComponent implements OnInit {
  types: Object[] = [
    {'type': 'summary data', 'value': 2},
    {'type': 'raw data', 'value': 1},
    {'type': 'unknown type', 'value': 198}
  ]

  constructor() { }

  ngOnInit() {
  }

}
