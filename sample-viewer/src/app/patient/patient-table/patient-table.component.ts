import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { tap } from 'rxjs/operators';
import { merge } from "rxjs/";
// import { pipe } from 'rxjs';
// import {debounceTime, distinctUntilChanged, startWith, tap, delay} from 'rxjs/operators';

import { GetPatientsService, PatientsDataSource, RequestParametersService, ApiService } from '../../_services/';
import { Patient, PatientArray, RequestParamArray } from '../../_models';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-patient-table',
  templateUrl: './patient-table.component.html',
  styleUrls: ['./patient-table.component.scss']
})
export class PatientTableComponent implements OnInit {
  // private patients: PatientArray;
  // private patientSummary: PatientArray;
  // patientSource: MatTableDataSource<Patient>;
  patientSource: PatientsDataSource;
  selectedLength: number;
  qString: HttpParams;

  displayedColumns: string[] = ['gID', 'sID', 'patientID', 'associatedSamples', 'cohort', 'outcome', 'elisa', 'country', 'age', 'gender', 'relatedTo', 'availableData'];

  // MatPaginator
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private requestSvc: RequestParametersService,
    private patientSvc: GetPatientsService,
    private apiSvc: ApiService,
  ) {


    route.data.subscribe(params => {
      this.selectedLength = params.patients.total;
      // console.log("selected length: " + this.selectedLength)
    });
  }

  ngOnInit() {
    // // custom sorters for nested objects
    // // Note: it seems to be working without this on a small sample size, but good to be explicit.
    // this.patientSource.sortingDataAccessor = (item, property) => {
    //   switch (property) {
    //     case 'associatedSamples': return item.associatedSamples ? item.associatedSamples.length : 0;
    //     case 'country': return item.country['name'];
    //     case 'availableData': return item.availableData ? item.availableData.length : 0;
    //     default: return item[property];
    //   }
    // };
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

      this.qString = this.requestSvc.reducePatientParams(qParams);
      // console.log(this.qString);
      this.loadPatientPage();
    })

    this.patientSource.resultCountState$.subscribe(ct => {
      this.selectedLength = ct;
    });

  }

  loadPatientPage() {
    // console.log("loadPatientPage Q:" + this.qString)
    this.patientSource.loadPatients(this.qString, this.paginator.pageIndex, this.paginator.pageSize,
      this.sort.active, this.sort.direction);

    // console.log(this.patientSource);


    // this.patientSvc.getPatientSummary(this.qString).subscribe(results => {
    //   this.selectedLength = results.total;
    // })

  }

  selectRow($event, row) {
    // $event.preventDefault();
    // $event.stopPropagation();  // <- that will stop propagation on lower layers

    this.router.navigate(['/patient', row.patientID]);
  }

}
