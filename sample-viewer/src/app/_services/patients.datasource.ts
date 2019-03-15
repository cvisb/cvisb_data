// based on https://blog.angular-university.io/angular-material-data-table/
import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { Observable, of, BehaviorSubject } from "rxjs";
import { GetPatientsService } from "./get-patients.service";
import { catchError, finalize } from "rxjs/operators";

import { Patient } from '../_models';


export class PatientsDataSource implements DataSource<Patient> {

  private patientsSubject = new BehaviorSubject<Patient[]>([]);

  // Loading spinner
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loadingState$ = this.loadingSubject.asObservable();

  constructor(private patientSvc: GetPatientsService) {

  }

  loadPatients(qParams, pageNum: number, pageSize: number, sortVar, sortDirection) {
    // console.log('calling patients.dataSource:loadPatients')

    this.loadingSubject.next(true);

    this.patientSvc.getPatientsPaginated(qParams, pageNum, pageSize, sortVar, sortDirection).pipe(
      catchError(() => of([])),
      finalize(() => this.loadingSubject.next(false))
    )
      .subscribe(patientList => this.patientsSubject.next(patientList));

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
