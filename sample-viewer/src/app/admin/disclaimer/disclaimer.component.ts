import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-disclaimer',
  templateUrl: './disclaimer.component.html',
  styleUrls: ['./disclaimer.component.scss']
})
export class DisclaimerComponent implements OnInit {
  cvisb_email: string = "info@cvisb.org";

  constructor() { }

  ngOnInit() {
  }

}
