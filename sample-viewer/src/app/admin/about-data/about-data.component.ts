import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about-data',
  templateUrl: './about-data.component.html',
  styleUrls: ['./about-data.component.scss']
})
export class AboutDataComponent implements OnInit {
  dateModified = "2019-01-24";

  constructor() { }

  ngOnInit() {
  }

}
