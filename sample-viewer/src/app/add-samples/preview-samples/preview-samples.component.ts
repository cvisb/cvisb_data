import { Component, OnChanges, Input, ViewChild } from '@angular/core';

import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-preview-samples',
  templateUrl: './preview-samples.component.html',
  styleUrls: ['./preview-samples.component.scss']
})

export class PreviewSamplesComponent implements OnChanges {
  @Input() data: Object[];
  @Input() hidePagination: boolean = false;
  @Input() displayedColumns: string[] = null;

  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  columnOrder = ["missing", "sampleID", "sampleLabel", "privatePatientID", "visitCode", "patientID", "sampleType", "isolationDate", "location", "numAliquots"];


  constructor() { }

  ngOnChanges() {
    if (!this.displayedColumns || this.displayedColumns.length === 0) {
      this.displayedColumns = Array.from(new Set(this.data.map(d => Object.keys(d)).flat()));
      // sort the columns in a sensible order
      this.displayedColumns.sort((a, b) => this.sortingFunc(a) - this.sortingFunc(b));
    }

    this.dataSource = new MatTableDataSource(this.data);
    this.dataSource.paginator = this.paginator;

    this.dataSource.sort = this.sort;
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
