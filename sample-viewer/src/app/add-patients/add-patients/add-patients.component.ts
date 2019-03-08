import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-add-patients',
  templateUrl: './add-patients.component.html',
  styleUrls: ['./add-patients.component.scss']
})
export class AddPatientsComponent implements OnInit {

  constructor(
    private titleSvc: Title,
    private route: ActivatedRoute
  ) {
    this.titleSvc.setTitle(this.route.snapshot.data.title)
  }

  ngOnInit() {
  }

}
