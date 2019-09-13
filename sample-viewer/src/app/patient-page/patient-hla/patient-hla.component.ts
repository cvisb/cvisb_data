import { Component, OnInit, Input, OnChanges } from '@angular/core';

import { GetHlaDataService, HlaService } from '../../_services';
import { Patient, HLA, D3Nested } from '../../_models';

import * as d3 from 'd3';

@Component({
  selector: 'app-patient-hla',
  templateUrl: './patient-hla.component.html',
  styleUrls: ['./patient-hla.component.scss'],
  // encapsulation: ViewEncapsulation.None
})

export class PatientHlaComponent implements OnChanges {
  @Input() patient: Patient;
  genotype: string[];
  alleleCount: any;
  selectedLocus: string;
  selectedAllele: string;
  backgroundColor: string;
  publishers: Object[];

  @Input() files: any[];

  constructor(private hlaSvc: GetHlaDataService, private hlaColorSvc: HlaService) {
    // --- unique alleles: population of all samples ---
    hlaSvc.alleleCountState$.subscribe((cts: D3Nested[]) => {
      this.alleleCount = cts;
    })

    hlaColorSvc.selectedLocusState$.subscribe((selectedLocus: string) => {
      this.selectedLocus = selectedLocus;

      this.backgroundColor = <string>hlaColorSvc.locusColors(selectedLocus);
    })

    hlaColorSvc.selectedAlleleState$.subscribe((selectedAllele: string) => {
      this.selectedAllele = selectedAllele;
    })


  }

  ngOnChanges() {
    this.hlaSvc.getHLAdata(this.patient.patientID).subscribe((res: Object[]) => {
      let hla_data = res['data'];
      this.publishers = res['publisher'];

      if (hla_data.length > 0) {
        this.genotype = hla_data.map((d: any) => d.allele);
      } else {
        this.genotype = null;
      }
    });
  }

  sendLocus(event, locus: string) {
    event.preventDefault();
    event.stopPropagation();
    this.hlaColorSvc.selectedLocusSubject.next(locus);
  }

  clearLocus() {
    this.hlaColorSvc.selectedLocusSubject.next(null);
  }

  sendAllele(event, allele: string) {
    event.preventDefault();
    event.stopPropagation();

    let locus = allele.split('\*')[0];
    this.hlaColorSvc.selectedAlleleSubject.next(allele);
    this.hlaColorSvc.selectedLocusSubject.next(locus);
  }

  clearAllele() {
    this.hlaColorSvc.selectedAlleleSubject.next(null);
  }

}
