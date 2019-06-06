import { Component, OnInit, ViewChild } from '@angular/core';
// import { SelectionModel } from '@angular/cdk/collections';
// import { FormControl, FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ActivatedRoute } from '@angular/router';

import { GetSamplesService } from '../../_services/';
import { Sample, SampleWide, Patient } from '../../_models';
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
  loading: boolean;
  dataSource: MatTableDataSource<any>;

  sample_types: string[] = ['frozenPBMC-DNA', 'frozenPBMC-RNA', 'plasma', 'PBMC'];
  displayedColumns: string[] = ["patientID", "privatePatientID", "visitCode", "cohort", "outcome"].concat(this.sample_types);
  // selection = new SelectionModel<any>(true, []);
  // editable: boolean = false;
  // locationForms = this.fb.group({
  //   lab: this.fb.array([]),
  //   aliquots: this.fb.array([])
  // });
  //
  // labs: Lab[];


  constructor(
    private sampleSvc: GetSamplesService,
    public dialog: MatDialog,
    private route: ActivatedRoute,
  ) {

    this.sampleSvc.samplesWideState$.subscribe((sList: Sample[]) => {
      this.dataSource = new MatTableDataSource(sList);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    })

    this.sampleSvc.loadingState$.subscribe((state: boolean) => {
      this.loading = state;
    })
  }



  ngOnInit() {
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
