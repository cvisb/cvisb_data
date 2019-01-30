import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { AuthService } from '../_services';

@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.scss']
})
export class PatientComponent implements OnInit {

  constructor(
    // private router: Router,
    private route: ActivatedRoute,
    private authSvc: AuthService,
    private titleSvc: Title) {
    route.data.subscribe(params => {
      // change the title of the page
      titleSvc.setTitle(params.title);
    });

    // call authentication service to check if logged in
    // authSvc.checkLogin();

  }

  ngOnInit() {
  }

}
