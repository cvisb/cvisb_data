import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-filter-location',
  templateUrl: './filter-location.component.html',
  styleUrls: ['./filter-location.component.scss']
})
export class FilterLocationComponent implements OnInit {

  @Input() countries;

  constructor() { }

  ngOnInit() {
  }

}
