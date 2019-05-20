import { Component, OnInit, Input } from '@angular/core';

import { MatSnackBar } from '@angular/material';

import { GetExperimentsService } from '../../_services';

import { ViralSeqObj } from '../../_models';

@Component({
  selector: 'app-patient-viral-seq',
  templateUrl: './patient-viral-seq.component.html',
  styleUrls: ['./patient-viral-seq.component.scss']
})
export class PatientViralSeqComponent implements OnInit {
  @Input() patientID: string;
  maxStars: number = 5;
  sequences: ViralSeqObj[];

  constructor(
    private snackBar: MatSnackBar,
    private exptSvc: GetExperimentsService) { }

  ngOnInit() {
    this.exptSvc.getExpt(this.patientID, 'viral sequencing').subscribe(res => {
      this.sequences = res['hits'];

      this.sequences.forEach((seq: any) => {
        if (seq.data.quality) {
          seq['data']['good'] = new Array(seq.data.quality);
          seq['data']['bad'] = new Array(this.maxStars - seq.data.quality);
        }
      });

      console.log(this.sequences)
    })



  }

  copySeq(seqElement, seqType) {
    console.log(seqElement)
    seqElement.select();
    document.execCommand('copy');
    this.snackBar.open(`${seqType} sequence`, "copied to clipboard!", {
      duration: 2000,
    });
  }




}
