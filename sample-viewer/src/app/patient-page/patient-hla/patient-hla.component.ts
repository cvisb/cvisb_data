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

  files: string[] = [
    'Genotype_calls.csv'
  ]

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
    let hla: any;

    let hla_data = this.hlaSvc.getpatientHLA(this.patient.patientID);
    console.log(hla_data);

    if (hla_data.length > 0) {
      this.genotype = hla_data.map(d => d.allele);

      // if (this.patient.availableData) {
      //   hla = this.patient.availableData.filter((d: any) => d.identifier === 'hla');
      //   this.genotype = hla.length === 1 ? hla[0]['data'] : null;
    } else {
      this.genotype = null;
    }
  }

  sendLocus(locus: string) {
    console.log(locus)
    this.hlaColorSvc.selectedLocusSubject.next(locus);
  }

  clearLocus() {
    console.log('mouseout')
    this.hlaColorSvc.selectedLocusSubject.next(null);
  }

  sendAllele(allele: string) {
    let locus = allele.split('\*')[0];
    console.log(allele)
    console.log(locus)
    this.hlaColorSvc.selectedAlleleSubject.next(allele);
    this.hlaColorSvc.selectedLocusSubject.next(locus);
  }

  clearAllele() {
    console.log('mouseout')
    this.hlaColorSvc.selectedAlleleSubject.next(null);
  }

}
