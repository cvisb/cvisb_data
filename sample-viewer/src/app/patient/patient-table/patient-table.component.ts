import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { tap } from 'rxjs/operators';
// import {debounceTime, distinctUntilChanged, startWith, tap, delay} from 'rxjs/operators';

import { GetPatientsService, PatientsDataSource } from '../../_services/';
import { Patient, PatientArray } from '../../_models';

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
  selectedPatient;
  patientList: any;

  displayedColumns: string[] = ['patientID', 'alternateIdentifier', 'associatedSamples', 'cohort', 'outcome', 'country', 'age', 'gender', 'relatedTo', 'availableData'];

  // MatPaginator
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private patientSvc: GetPatientsService,
  ) {

    // // grab the data
    // this.patientSvc.patientsState$.subscribe((pList: PatientArray) => {
    //   this.patientSource = new MatTableDataSource(pList.patients);
    // })

  }

  ngOnInit() {
    this.patientList = this.route.snapshot.data['patients'];
    console.log(this.patientList)
    // this.patientSource.paginator = this.paginator;
    //
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
    //
    // this.patientSource.sort = this.sort;
    this.patientSource = new PatientsDataSource(this.patientSvc);
    this.patientSource.loadPatients("__all__", 0, 20, ["age"]);
    console.log(this.patientSource)
  }

  // ngAfterViewInit() {
  //
  //     this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
  //
  //     fromEvent(this.input.nativeElement,'keyup')
  //         .pipe(
  //             debounceTime(150),
  //             distinctUntilChanged(),
  //             tap(() => {
  //                 this.paginator.pageIndex = 0;
  //
  //                 this.loadPatientPage();
  //             })
  //         )
  //         .subscribe();
  //
  //     merge(this.sort.sortChange, this.paginator.page)
  //     .pipe(
  //         tap(() => this.loadPatientPage())
  //     )
  //     .subscribe();
  //
  // }
  //
  ngAfterViewInit() {
    this.paginator.page
      .pipe(
        tap(() => this.loadPatientPage())
      )
      .subscribe();
  }

  loadPatientPage() {
    this.patientSource.loadPatients("__all__", this.paginator.pageIndex, this.paginator.pageSize, ["age"]);
  }

  selectRow($event, row) {
    // $event.preventDefault();
    // $event.stopPropagation();  // <- that will stop propagation on lower layers

    // this.selectedPatient = row;
    this.router.navigate(['/patient', row.patientID]);
  }

}
