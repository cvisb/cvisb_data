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
    this.alternateIDs.forEach(id => {
      this.apiSvc.getOne('sample', id, 'privatePatientID', true).subscribe(res => {
        this.samples = this.samples.concat(res);
      })
    })
  }

  showSampleMD($event: Event, sample): void {
    $event.preventDefault();
    $event.stopPropagation();  // <- that will stop propagation on lower layers

    const dialogRef = this.dialog.open(SampleMetadataComponent, {
      width: '450px',
      data: sample
    });
  }

}
