import { Component, OnInit, Inject, PLATFORM_ID} from '@angular/core';

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
  @Inject(PLATFORM_ID) private platformId: Object
) {

  }

  ngOnInit() {
    if(isPlatformBrowser(this.platformId)) {
      this.hlaSvc.patientTypeState$.subscribe((types: D3Nested[]) => {
        this.patientTypes = types;
      })

      this.hlaSvc.patientOutcomeState$.subscribe((outcomes: D3Nested[]) => {
        this.patientOutcomes = outcomes;
      })

      this.hlaSvc.patientCountState$.subscribe((num: number) => {
        this.patientCount = num;
      })

      this.hlaSvc.alleleCountState$.subscribe((cts: D3Nested[]) => {
        this.alleleCount = cts;
      })

      this.hlaSvc.novelAllelesState$.subscribe((novel: D3Nested[]) => {
        this.novelAlleles = novel;
      })
    }
  }

}
