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

    this.myhttp.get<any[]>(`${environment.api_url}/api/patient/query`, {
      observe: 'response',
      headers: new HttpHeaders()
        .set('Accept', 'application/json'),
      params: new HttpParams()
        .set('q', `__all__`)
        .set('patientID', this.alternateIDs[0])
    }).pipe(
      map(res => {
        console.log(res);
        this.samples = res["body"];
        this.samples.sort((a: any, b: any) => +a.visitCode - +b.visitCode);
      }
      )
    );
  }

  //   this.apiSvc.getOne('sample', id, 'privatePatientID', true).subscribe(res => {
  //     this.samples = this.samples.concat(res);
  //   })
  //
  // this.samples.sort((a:any, b:any) => +a.visitCode - +b.visitCode)
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
