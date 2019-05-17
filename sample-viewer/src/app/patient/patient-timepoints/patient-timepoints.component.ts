import { Component, OnInit, Input } from '@angular/core';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { SampleMetadataComponent } from '../../_dialogs';

import { Sample } from '../../_models';
import { ApiService } from '../../_services';

import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, Subject, BehaviorSubject, throwError, forkJoin } from 'rxjs';
import { map, catchError } from "rxjs/operators";

import { environment } from "../../../environments/environment";

// services
import { MyHttpClient } from '../../_services/http-cookies.service';



@Component({
  selector: 'app-patient-timepoints',
  templateUrl: './patient-timepoints.component.html',
  styleUrls: ['./patient-timepoints.component.scss']
})

export class PatientTimepointsComponent implements OnInit {
  @Input() alternateIDs: string[];
  @Input() showMissing: boolean = false;
  samples: Object[] = [];

  constructor(private apiSvc: ApiService,
    public dialog: MatDialog,
    private myhttp: MyHttpClient) { }

  ngOnInit() {
    let params = new HttpParams()
      .set("patientID", this.alternateIDs[0])
      .set("q", "__all__");

    this.apiSvc.getPaginated('sample', params).subscribe(res => {
      console.log(res)
      this.samples = res['hits'];
      this.samples.sort((a: any, b: any) => +a.visitCode - +b.visitCode)
    })


  }

  showSampleMD($event: Event, sample): void {
    $event.preventDefault();
    $event.stopPropagation();  // <- that will stop propagation on lower layers

    const dialogRef = this.dialog.open(SampleMetadataComponent, {
      width: '850px',
      data: sample
    });
  }

}
