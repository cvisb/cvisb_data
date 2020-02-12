import { Component, Input } from '@angular/core';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { SampleMetadataComponent } from '../_dialogs';

import { Sample } from '../_models';

@Component({
  selector: 'app-patient-timepoints',
  templateUrl: './patient-timepoints.component.html',
  styleUrls: ['./patient-timepoints.component.scss']
})

export class PatientTimepointsComponent {
  @Input() showMissing: boolean = false;
  @Input() samples: Sample[];

  constructor(public dialog: MatDialog) { }

  showSampleMD($event: Event, sample): void {
    $event.preventDefault();
    $event.stopPropagation();  // <- that will stop propagation on lower layers

    const dialogRef = this.dialog.open(SampleMetadataComponent, {
      width: '75vw',
      data: sample
    });
  }

}
