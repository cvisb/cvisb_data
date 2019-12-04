import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { Subscription } from 'rxjs';

@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.scss']
})

export class PatientComponent implements OnDestroy {
  titleSubscription: Subscription;

  constructor(
    // private router: Router,
    private route: ActivatedRoute,
    private titleSvc: Title) {

    this.titleSubscription = this.route.data.subscribe(params => {
      // change the title of the page
      this.titleSvc.setTitle(params.title);
    });

  }

  ngOnDestroy() {
    this.titleSubscription.unsubscribe();
  }

}
