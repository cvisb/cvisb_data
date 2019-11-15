import { Component, OnChanges, Input } from '@angular/core';

import { MatSnackBar } from '@angular/material';

import { ApiService } from '../../_services';

import { ViralSeqObj } from '../../_models';

@Component({
  selector: 'app-patient-viral-seq',
  templateUrl: './patient-viral-seq.component.html',
  styleUrls: ['./patient-viral-seq.component.scss']
})
export class PatientViralSeqComponent implements OnChanges {
  maxStars: number = 5;
  @Input() sequences: ViralSeqObj[];
  @Input() patientID: string;
  @Input() datasetID: string;
  ncbiAccessionStub: string = "https://www.ncbi.nlm.nih.gov/nuccore/"; // website to link accession numbers, like https://www.ncbi.nlm.nih.gov/nuccore/LN823982

  constructor(
    private snackBar: MatSnackBar) { }

  ngOnChanges() {
    if (this.sequences) {
      this.sequences.forEach((seq: any) => {
        seq['source'] = seq['publisher'] ? seq['publisher']['name'] : null;
        if (seq.data.quality) {
          seq['data']['good'] = new Array(seq.data.quality);
          seq['data']['bad'] = new Array(this.maxStars - seq.data.quality);
        }
      });
    }
  }

  copySeq(seqElement, seqType) {
    seqElement.select();
    document.execCommand('copy');
    this.snackBar.open(`${seqType} sequence`, "copied to clipboard!", {
      duration: 2000,
    });
  }


}
