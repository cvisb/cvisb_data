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

import { Sample, SampleWide, RequestParamArray } from '../_models';

import { uniq, difference } from 'lodash';

export class SamplesDataSource implements DataSource<SampleWide> {
  private samplesSubject = new BehaviorSubject<SampleWide[]>([]);

  // All column names
  private staticColumns: string[] = ["patientID", "privatePatientID", "visitCode", "cohort", "outcome"];
  private displayedColumnsSubject = new BehaviorSubject<string[]>([]);
  public displayedColumns$ = this.displayedColumnsSubject.asObservable();

  // Samples column names
  private sampleTypeSubject = new BehaviorSubject<string[]>([]);
  public sampleTypes$ = this.sampleTypeSubject.asObservable();

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

  loadSamples(qParamArray: RequestParamArray, sortVar: string, sortDir: string, pageIdx: number, pageSize: number) {
    console.log(sortVar)
    console.log('calling samples.dataSource:loadSamples')
    console.log(qParamArray)

    this.loadingSubject.next(true);

    this.sampleSvc.getSamples(qParamArray, sortVar, sortDir, pageIdx, pageSize).pipe(
      catchError(() => of([])),
      finalize(() => this.loadingSubject.next(false))
    )
      .subscribe(sampleList => {
        console.log('sample list from data source:')
        console.log(sampleList)
        if (sampleList.sampleWide) {
          let filteredSamples = sampleList.sampleWide.slice(pageIdx * pageSize, (pageIdx + 1) * pageSize);
          this.resultCountSubject.next(sampleList.samples.length);
          this.samplesSubject.next(filteredSamples);

          // get the column names to display in the table
          let cols = uniq(sampleList.sampleWide.flatMap(d => Object.keys(d)));
          console.log(cols);
          let sampleCols = difference(cols, this.staticColumns);
          console.log(sampleCols)
          this.displayedColumnsSubject.next(cols);
          this.sampleTypeSubject.next(sampleCols);
        }
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
