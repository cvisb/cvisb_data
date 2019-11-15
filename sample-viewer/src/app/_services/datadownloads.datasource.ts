// based on https://blog.angular-university.io/angular-material-data-table/
// For server-side filtering
import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { Observable, of, BehaviorSubject } from "rxjs";
import { ApiService } from "./api.service";
import { catchError, finalize } from "rxjs/operators";

import { DataDownload } from '../_models';

import { intersectionWith, isEqual } from 'lodash';


export class DownloadsDataSource implements DataSource<DataDownload> {

  private downloadsSubject = new BehaviorSubject<DataDownload[]>([]);

  // Loading spinner
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loadingState$ = this.loadingSubject.asObservable();

  // Result count
  private resultCountSubject = new BehaviorSubject<number>(0);
  public resultCountState$ = this.resultCountSubject.asObservable();

  constructor(private apiSvc: ApiService) {

  }

  loadDownloads(params, pageNum: number, pageSize: number, sortVar, sortDirection) {
    this.loadingSubject.next(true);

    this.apiSvc.getPaginated('datadownload', params, pageNum, pageSize, sortVar, sortDirection).pipe(
      catchError(() => of([])),
      finalize(() => this.loadingSubject.next(false))
    )
      .subscribe(files => {
        let downloads = files['hits'];
        this.resultCountSubject.next(files['total'])
        this.downloadsSubject.next(downloads)
      });

  }

  connect(collectionViewer: CollectionViewer): Observable<DataDownload[]> {
    return this.downloadsSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.downloadsSubject.complete();
    this.loadingSubject.complete();
  }

}
