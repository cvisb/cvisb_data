import { Component, Input } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import { AnchorService } from '../../_services';

@Component({
  selector: 'app-patient-nav',
  templateUrl: './patient-nav.component.html',
  styleUrls: ['./patient-nav.component.scss']
})
export class PatientNavComponent {
  @Input() cohort: string;
  private patientID: string;

  links: any =
    ['samples', 'demographics', 'related patients', 'citations',
      { 'key': 'data', 'values': ['HLA sequencing', 'Systems Serology', "Viral sequencing"] }
    ];

  constructor(
    private route: ActivatedRoute,
    private anchorSvc: AnchorService
  ) {
    this.route.params.subscribe(params => {
      this.patientID = params.pid;
    })

  }

  onAnchorClick(anchor_tag: string) {
    this.anchorSvc.clickAnchor(anchor_tag);
  }

  isObject(value) {
    // necessary b/c can't use typeof in html in Angular...
    return typeof value === 'object';
  }

}
