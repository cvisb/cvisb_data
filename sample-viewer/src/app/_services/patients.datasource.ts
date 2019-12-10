// based on https://blog.angular-university.io/angular-material-data-table/
// For server-side filtering
import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { Observable, of, BehaviorSubject } from "rxjs";
import { ApiService } from "./api.service";
import { GetPatientsService } from './get-patients.service';
import { catchError, finalize, tap } from "rxjs/operators";

import { Patient, PatientSummary } from '../_models';

import { intersectionWith, isEqual } from 'lodash';


export class PatientsDataSource implements DataSource<Patient> {

  private patientsSubject = new BehaviorSubject<Patient[]>([]);

  // Loading spinner
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loadingState$ = this.loadingSubject.asObservable();

  // Patient count
  private resultCountSubject = new BehaviorSubject<number>(0);
  public resultCountState$ = this.resultCountSubject.asObservable();

  constructor(
    private patientSvc: GetPatientsService
  ) {

  }

  loadPatients(pageNum: number, pageSize: number, sortVar: string, sortDirection: string) {
    console.log('calling patients.dataSource:loadPatients')

    this.loadingSubject.next(true);

    /*
    Call to get both patients and their associated samples/experiments.
    1) Get paginated results for patients.
    2) Use those patientIDs to query /experiment
    3) Merge the two results together.
     */
    this.patientSvc.loadPatients(pageNum, pageSize, sortVar, sortDirection).pipe(
      catchError(() => of([])),
      finalize(() => this.loadingSubject.next(false)),
      tap(x => console.log(x))
    )
      .subscribe(patientList => {
        console.log(patientList)
        this.resultCountSubject.next(patientList['total']);
        this.patientsSubject.next(patientList['hits']);
        this.patientSvc.patientsSummarySubject.next(patientList['summary']);
      });

    // Working version, with single call to only get patients, not experiments
    // this.apiSvc.getPaginated('patient', qParams, pageNum, pageSize, sortVar, sortDirection).pipe(
    //   catchError(() => of([])),
    //   finalize(() => this.loadingSubject.next(false))
    // )
    //   .subscribe(patientList => {
    //     this.resultCountSubject.next(patientList['total'])
    //     this.patientsSubject.next(patientList['hits'])
    //   });

  }

  connect(collectionViewer: CollectionViewer): Observable<Patient[]> {
    // console.log("Connecting data source");
    return this.patientsSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.patientsSubject.complete();
    this.loadingSubject.complete();
    this.patientSvc.patientsSummarySubject.complete();
  }

}
