import { Component, Input, AfterViewInit } from '@angular/core';

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
    ['demographics', 'samples', 'clinical observations',
      { 'key': 'data', 'values': ['ELISA', 'HLA sequencing', "Viral Sequencing"]},
      'citations'
    ];

  constructor(
    private route: ActivatedRoute,
    private anchorSvc: AnchorService
  ) {
    this.route.params.subscribe(params => {
      this.patientID = params.pid;
    })

  }

  onAnchorClick(event, anchor_tag: string) {
    console.log("anchor_tag clicked: " + anchor_tag)
    event.stopPropagation();
    // this.anchorSvc.clickAnchor(anchor_tag);
  }

  ngAfterViewInit() {
    // For anchor jumping
    // Needs to be in ngOnInit to make sure page exists before querying document
    this.route.fragment.subscribe(anchor_tag => {
      console.log('nav page: anchor click- ' + anchor_tag)
      this.anchorSvc.clickAnchor(anchor_tag);
    })
  }


  isObject(value) {
    // necessary b/c can't use typeof in html in Angular...
    return typeof value === 'object';
  }

}
