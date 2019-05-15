import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { FormControl, FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ActivatedRoute } from '@angular/router';

import { GetSamplesService, LabLocationsService, AuthService } from '../../_services/';
import { Sample, SampleWide, Lab } from '../../_models';
import { SampleMetadataComponent } from '../../_dialogs';

import * as d3 from 'd3';

@Component({
  selector: 'app-sample-table',
  templateUrl: './sample-table.component.html',
  styleUrls: ['./sample-table.component.scss']
})
export class SampleTableComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  editable: boolean = false;

  dataSource: MatTableDataSource<any>;

  sample_types: string[] = ['DNA', 'viralRNA', 'plasma', 'PBMC'];
  displayedColumns: string[] = ["patientID", "privatePatientID", "visitCode"].concat(this.sample_types);
  // displayedColumns: string[] = ["key", "privatePatientID", "cohort", "outcome", "visitCode"].concat(this.sample_types);
  selection = new SelectionModel<any>(true, []);

  locationForms = this.fb.group({
    lab: this.fb.array([]),
    aliquots: this.fb.array([])
  });

  labs: Lab[];
  samples: Sample[];
  samples_wide: SampleWide[];


  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any) => {

      console.error(error); // log to console instead

    };
  }

  constructor(
    private fb: FormBuilder,
    private sampleSvc: GetSamplesService,
    private labSvc: LabLocationsService,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private authSvc: AuthService,
  ) {

    // call authentication service to check if logged in
    // authSvc.checkLogin();

    this.sampleSvc.samplesWideState$.subscribe((sList: Sample[]) => {
      this.samples_wide = sList;
      console.log(sList)

      this.dataSource = new MatTableDataSource(this.samples_wide);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    })
  }



  ngOnInit() {
  }

  showSampleMD(sample): void {
    console.log("metadata!")
    console.log(sample)
    const dialogRef = this.dialog.open(SampleMetadataComponent, {
      width: '450px',
      data: sample
    });
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  get aliases() {
    return this.locationForms.get('aliases') as FormArray;
  }

  onSubmit() {
    console.log("SUBMITTING")
    console.log(this.locationForms);
  }

  switchEditable() {
    console.log('switching editing')
    this.editable = !this.editable;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  clearInput() {
  }

}
