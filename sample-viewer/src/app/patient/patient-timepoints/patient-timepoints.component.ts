import { Component, OnInit, Input } from '@angular/core';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { SampleMetadataComponent } from '../../_dialogs';

import { Sample } from '../../_models';
import { ApiService } from '../../_services';

@Component({
  selector: 'app-patient-timepoints',
  templateUrl: './patient-timepoints.component.html',
  styleUrls: ['./patient-timepoints.component.scss']
})

export class PatientTimepointsComponent implements OnInit {
  @Input() alternateIDs: string[];
  samples: Object[] = [];

  constructor(private apiSvc: ApiService,
    public dialog: MatDialog, ) { }

  ngOnInit() {
    console.log(this.alternateIDs);

    this.alternateIDs.forEach(id => {
      this.apiSvc.getOne('sample', id, 'privatePatientID').subscribe(res => {
        console.log(res);
        this.samples = this.samples.concat(res);
      })
    })
    console.log(this.samples)

    this.samples = [{ "visitCode": "1", "sampleType": "viralRNA" }, { "visitCode": "1", "sampleType": "PBMC" }, { "visitCode": "2", "sampleType": "viralRNA" }, { "visitCode": "1", "sampleType": "DNA" }];

  }

  showSampleMD(sample): void {
    console.log("metadata!")
    console.log(sample)
    const dialogRef = this.dialog.open(SampleMetadataComponent, {
      width: '450px',
      data: sample
    });
  }

}
