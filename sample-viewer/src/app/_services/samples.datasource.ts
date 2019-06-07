// based on https://blog.angular-university.io/angular-material-data-table/
// For server-side filtering
// HOWEVER-- server-side filtering doesn't really work, since the data need to be nested before they're filtered.
// So relying still on client-side pagination/sorting
// BUT-- need datasource so the table updates if the data changes (not cached)
import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { Observable, of, BehaviorSubject } from "rxjs";
// import { ApiService } from "./api.service";
import { GetSamplesService } from './get-samples.service';
import { catchError, finalize } from "rxjs/operators";

import { Sample, SampleWide } from '../_models';

export class SamplesDataSource implements DataSource<SampleWide> {

  private samplesSubject = new BehaviorSubject<SampleWide[]>([]);

  // Loading spinner
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loadingState$ = this.loadingSubject.asObservable();

  // Samples count
  private resultCountSubject = new BehaviorSubject<number>(0);
  public resultCountState$ = this.resultCountSubject.asObservable();

  constructor(
    private sampleSvc: GetSamplesService,
  ) {

  }

  loadSamples(qParams) {
    console.log('calling samples.dataSource:loadSamples')

    this.loadingSubject.next(true);

    this.sampleSvc.getSamples(qParams).pipe(
      catchError(() => of([])),
      finalize(() => this.loadingSubject.next(false))
    )
      .subscribe(sampleList => {
        console.log('sample list from data source:')
        console.log(sampleList)
        this.resultCountSubject.next(sampleList.samples.length);
        this.samplesSubject.next(sampleList.sampleWide);
      });

  }

  connect(collectionViewer: CollectionViewer): Observable<SampleWide[]> {
    console.log("Connecting data source");
    return this.samplesSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.samplesSubject.complete();
    this.loadingSubject.complete();
  }

}
