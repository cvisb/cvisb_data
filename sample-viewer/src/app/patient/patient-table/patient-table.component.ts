import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { tap } from 'rxjs/operators';
import { merge } from "rxjs/";

import { PatientsDataSource, RequestParametersService, ApiService } from '../../_services/';
import { Patient, PatientArray, RequestParamArray } from '../../_models';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-patient-table',
  templateUrl: './patient-table.component.html',
  styleUrls: ['./patient-table.component.scss']
})

export class PatientTableComponent implements OnInit {
  patientSource: PatientsDataSource;
  selectedLength: number;
  qParams: HttpParams[];

  displayedColumns: string[] = ['gID', 'sID', 'patientID', 'associatedSamples', 'cohort', 'outcome', 'elisa', 'country', 'age', 'gender', 'relatedTo', 'availableData'];

  // MatPaginator
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private requestSvc: RequestParametersService,
    private apiSvc: ApiService,
  ) {


    route.data.subscribe(params => {
      this.selectedLength = params.patients.total;
    });
  }

  ngOnInit() {
    this.patientSource = new PatientsDataSource(this.apiSvc);
    this.patientSource.loadPatients(new HttpParams().set("q", "__all__"), 0, 10, "", null);
  }


  ngAfterViewInit() {
    // reset the paginator after sorting
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => this.loadPatientPage())
      )
      .subscribe();

    // listen for changes in the request parameters, update data source
    this.requestSvc.patientParamsState$.subscribe((qParams: RequestParamArray) => {
      // console.log("qParams heard in patient-table")
      // console.log(qParams)

      this.qParams = this.requestSvc.reducePatientParams(qParams);
      // console.log(this.qParams);
      this.loadPatientPage();
    })

    this.patientSource.resultCountState$.subscribe(ct => {
      this.selectedLength = ct;
    });

  }

  loadPatientPage() {
    this.patientSource.loadPatients(this.qParams, this.paginator.pageIndex, this.paginator.pageSize,
      this.sort.active, this.sort.direction);
  }

  selectRow($event, row) {
    this.router.navigate(['/patient', row.patientID]);
  }

}
