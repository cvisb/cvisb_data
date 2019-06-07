import { Component, OnChanges, ViewChild } from '@angular/core';

import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

import { SampleUploadService } from '../../_services';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SpinnerPopupComponent } from '../../_dialogs';

import { isEqual } from 'lodash';

@Component({
  selector: 'app-preview-differences',
  templateUrl: './preview-differences.component.html',
  styleUrls: ['./preview-differences.component.scss']
})
export class PreviewDifferencesComponent implements OnChanges {
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[];
  locationColumns: string[];
  errorMsg: string;

  loadingBox;

  columnOrder = ["sampleID", "sampleLabel", "privatePatientID", "visitCode", "location", "sampleType", "isolationDate", "_id"];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private uploadSvc: SampleUploadService, public dialog: MatDialog, ) {
    uploadSvc.previewDifferencesState$.subscribe((mergedObj: any) => {

      let merged = mergedObj.merged;
      this.displayedColumns = mergedObj.displayedColumns;
      this.locationColumns = mergedObj.locationColumns;

      if (merged && merged.length > 0) {
        this.displayedColumns.sort((a, b) => this.sortingFunc(a) - this.sortingFunc(b));
        this.locationColumns.sort((a, b) => this.sortingFunc(a) - this.sortingFunc(b));

        this.dataSource = new MatTableDataSource(merged.filter(d => d._merge === "both"));
        this.dataSource.paginator = this.paginator;

        // custom sorting function, to deal w/ the nested-ness of the data.
        // sort by default by the *new* value, not the old one.
        this.dataSource.sortingDataAccessor = (item, property) => {
          switch (property) {
            default: return item[property + "_y"];
          }
        };
        this.dataSource.sort = this.sort;

      } else {
        this.dataSource = new MatTableDataSource();
      }
    })

    uploadSvc.loadingState$.subscribe((loading: any) => {
      if (loading) {
        this.loadingBox = this.dialog.open(SpinnerPopupComponent, {
          width: '300px',
          data: `loading samples...`,
          disableClose: true
        });
      } else if (this.loadingBox) {
        this.loadingBox.close()
      }

    })

  }

  ngOnChanges() {
    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
    // console.log(this.dataSource)
  }

  checkEqual(a, b) {
    return (isEqual(a, b))
  }

  sortingFunc(a) {
    let idx = this.columnOrder.indexOf(a);
    // if not found, return dummy so sorts at the end
    if (idx < 0) {
      return (1000);
    }
    return (idx);
  }

}
