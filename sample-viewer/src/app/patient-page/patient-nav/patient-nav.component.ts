import { Component, Input, AfterViewInit, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import { AnchorService } from '../../_services';

@Component({
  selector: 'app-patient-nav',
  templateUrl: './patient-nav.component.html',
  styleUrls: ['./patient-nav.component.scss']
})
export class PatientNavComponent implements AfterViewInit, OnInit{
  @Input() cohort: string;
  @Input() expts: Object[];
  private patientID: string;

  links: any =
    ['demographics', 'samples']
  links_end: any = ['citations'];

  constructor(
    private route: ActivatedRoute,
    private anchorSvc: AnchorService
  ) {
    this.route.params.subscribe(params => {
      this.patientID = params.pid;
    })
  }

  public scroll(element: any) {
    element.scrollIntoView({ behavior: 'smooth' });
  }

  ngOnInit() {
    if (this.expts && this.expts.length > 0) {
      this.links.push({ 'key': 'data', 'values': this.expts.map((d: any) => d.measurementCategory) }).append(this.links_end);
    }
  }

  ngAfterViewInit() {
    // For anchor jumping
    // Needs to be in ngOnInit to make sure page exists before querying document
    this.route.fragment.subscribe(anchor_tag => {
      this.anchorSvc.clickAnchor(anchor_tag);
    })
  }


  isObject(value) {
    // necessary b/c can't use typeof in html in Angular...
    return typeof value === 'object';
  }

}
