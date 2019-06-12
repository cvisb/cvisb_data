import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
// import { SelectionModel } from '@angular/cdk/collections';
// import { FormControl, FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs/operators';
import { merge } from "rxjs/";

// import { HttpParams } from '@angular/common/http';

import { SamplesDataSource, ApiService, GetSamplesService, RequestParametersService } from '../../_services/';
import { Sample, SampleWide, Patient, RequestParamArray } from '../../_models';
import { SampleMetadataComponent } from '../../_dialogs';

@Component({
  selector: 'app-sample-table',
  templateUrl: './sample-table.component.html',
  styleUrls: ['./sample-table.component.scss']
})

export class SampleTableComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  samplePatientMD: Patient[];
  params: RequestParamArray;
  // dataSource: MatTableDataSource<any>;
  dataSource: SamplesDataSource;
  // loading: boolean;

  // sample_types: string[];
  // displayedColumns: string[];
  // selection = new SelectionModel<any>(true, []);
  // editable: boolean = false;
  // locationForms = this.fb.group({
  //   lab: this.fb.array([]),
  //   aliquots: this.fb.array([])
  // });
  //
  // labs: Lab[];


  constructor(
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private sampleSvc: GetSamplesService,
    private apiSvc: ApiService,
    private requestSvc: RequestParametersService
  ) {
    // this.sampleSvc.loadingState$.subscribe((state: boolean) => {
    //   this.loading = state;
    // })
  }



  ngOnInit() {
    this.dataSource = new SamplesDataSource(this.sampleSvc, this.apiSvc);
    this.dataSource.loadSamples([], "", null, 0, 10);
    // this.dataSource.loadSamples(new HttpParams().set("q", "__all__"));
  }

  ngAfterViewInit() {
    // Listener for changes in query params
    this.requestSvc.sampleParamsState$.subscribe((params: RequestParamArray) => {
      console.log("Sample table calling new request to update data")
      console.log(params)
      this.params = params;
      this.loadSamples();
    })

    // reset the paginator after sorting
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => this.loadSamples())
      )
      .subscribe();

  }

  loadSamples() {
    this.dataSource.loadSamples(this.params,
      this.sort.active,
      this.sort.direction,
      this.paginator.pageIndex,
      this.paginator.pageSize);
  }

  showSampleMD(sample): void {
    const dialogRef = this.dialog.open(SampleMetadataComponent, {
      width: '75vw',
      data: sample
    });
  }

  /** Whether the number of selected elements matches the total number of rows. */
  // isAllSelected() {
  //   const numSelected = this.selection.selected.length;
  //   const numRows = this.dataSource.data.length;
  //   return numSelected === numRows;
  // }

  // get aliases() {
  //   return this.locationForms.get('aliases') as FormArray;
  // }
  //
  // onSubmit() {
  //   console.log("SUBMITTING")
  //   console.log(this.locationForms);
  // }
  //
  // switchEditable() {
  //   console.log('switching editing')
  //   this.editable = !this.editable;
  // }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  // masterToggle() {
  //   this.isAllSelected() ?
  //     this.selection.clear() :
  //     this.dataSource.data.forEach(row => this.selection.select(row));
  // }
  //
  // clearInput() {
  // }

}
