// based on https://blog.angular-university.io/angular-material-data-table/
// For server-side filtering
import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { Observable, of, BehaviorSubject } from "rxjs";
import { ApiService } from "./api.service";
import { catchError, finalize } from "rxjs/operators";

import { Patient } from '../_models';

import { intersectionWith, isEqual } from 'lodash';


export class PatientsDataSource implements DataSource<Patient> {

  private patientsSubject = new BehaviorSubject<Patient[]>([]);

  // Loading spinner
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loadingState$ = this.loadingSubject.asObservable();

  // Patient count
  private resultCountSubject = new BehaviorSubject<number>(0);
  public resultCountState$ = this.resultCountSubject.asObservable();

  constructor(private apiSvc: ApiService) {

  }

  loadPatients(qParams, pageNum: number, pageSize: number, sortVar, sortDirection) {
    // console.log('calling patients.dataSource:loadPatients')

    this.loadingSubject.next(true);

    this.apiSvc.getMultipleRequests('patient', qParams, pageNum, pageSize, sortVar, sortDirection).pipe(
      catchError(() => of([])),
      finalize(() => this.loadingSubject.next(false))
    )
      .subscribe(patientArray => {
        console.log(patientArray);

        let patientList = intersectionWith(... patientArray.map(d => d['hits']), isEqual);
        console.log(patientList)
        // this.resultCountSubject.next(patientList['total'])
        // this.patientsSubject.next(patientList['hits'])
        this.resultCountSubject.next(patientList.length)
        this.patientsSubject.next(patientList)
      });
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
  }

}
