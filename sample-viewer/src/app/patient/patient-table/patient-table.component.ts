import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatPaginator, MatSort } from '@angular/material';
import { tap } from 'rxjs/operators';
import { merge, Observable } from "rxjs/";

import { PatientsDataSource, RequestParametersService, AuthService, GetPatientsService } from '../../_services/';
import { AuthState, RequestParamArray } from '../../_models';
import { HttpParams } from '@angular/common/http';
import{ faVenus, faMars } from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-patient-table',
  templateUrl: './patient-table.component.html',
  styleUrls: ['./patient-table.component.scss']
})

export class PatientTableComponent implements OnInit {
  patientSource: PatientsDataSource;
  selectedLength$: Observable<number>;
  qParams: HttpParams;

  displayedColumns: string[];
  // sID, gID irrelevant when not logged in
  publicColumns: string[] = ['patientID', 'cohort', 'outcome', 'elisa', 'country', 'age', 'gender', 'relatedTo', 'availableData'];
  privateColumns: string[] = ['gID', 'sID', 'patientID', 'associatedSamples', 'cohort', 'outcome', 'elisa', 'country', 'age', 'gender', 'relatedTo', 'availableData'];

  // MatPaginator
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  // FontAwesome icons
  faVenus = faVenus;
  faMars = faMars;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private requestSvc: RequestParametersService,
    private patientSvc: GetPatientsService,
    private authSvc: AuthService
  ) {
    // this.route.data.subscribe(params => {
    //   this.selectedLength = params.patients.total;
    // });

    this.authSvc.authState$.subscribe((status: AuthState) => {
      if (status.authorized) {
        this.displayedColumns = this.privateColumns;
      } else {
        this.displayedColumns = this.publicColumns;
      }
    })
  }

  ngOnInit() {
    this.patientSource = new PatientsDataSource(this.patientSvc);
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

    this.selectedLength$ = this.patientSource.resultCountState$;

  }

  loadPatientPage() {
    this.patientSource.loadPatients(this.qParams, this.paginator.pageIndex, this.paginator.pageSize,
      this.sort.active, this.sort.direction);
  }

  selectRow(_, row) {
    this.router.navigate(['/patient', row.patientID]);
  }

}
