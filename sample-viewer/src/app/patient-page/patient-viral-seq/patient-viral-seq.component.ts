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

  constructor(
    private snackBar: MatSnackBar) { }

  ngOnChanges() {
    if (this.sequences) {
      this.sequences.forEach((seq: any) => {
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
