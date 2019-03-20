import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import { isPlatformBrowser } from '@angular/common';

import { GetHlaDataService } from '../../../_services';
import { HLA, D3Nested } from '../../../_models';

@Component({
  selector: 'app-hla-summary',
  templateUrl: './hla-summary.component.html',
  styleUrls: ['./hla-summary.component.scss']
})
export class HlaSummaryComponent implements OnInit {
  patientTypes: D3Nested[];
  patientOutcomes: D3Nested[];
  patientCount: number;
  alleleCount: D3Nested[];
  novelAlleles: D3Nested[];

  constructor(private hlaSvc: GetHlaDataService,
    private route: ActivatedRoute,) {

      route.data.subscribe(params => {
        console.log("route data")
        console.log(params)
      });

    hlaSvc.patientTypeState$.subscribe((types: D3Nested[]) => {
      this.patientTypes = types;
    })

    hlaSvc.patientOutcomeState$.subscribe((outcomes: D3Nested[]) => {
      this.patientOutcomes = outcomes;
    })

    hlaSvc.patientCountState$.subscribe((num: number) => {
      this.patientCount = num;
    })

    hlaSvc.alleleCountState$.subscribe((cts: D3Nested[]) => {
      this.alleleCount = cts;
    })

    hlaSvc.novelAllelesState$.subscribe((novel: D3Nested[]) => {
      this.novelAlleles = novel;
    })
  }

  ngOnInit() {
  }

}
