import { Component, OnChanges, Input, ViewChild } from '@angular/core';

import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-preview-samples',
  templateUrl: './preview-samples.component.html',
  styleUrls: ['./preview-samples.component.scss']
})

export class PreviewSamplesComponent implements OnChanges {
  @Input() data: Object[];
  @Input() showPagination: boolean = true;
  @Input() displayedColumns: string[];

  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  
  columnOrder = ["missing", "sampleID", "sampleLabel", "privatePatientID", "visitCode", "patientID", "sampleType", "isolationDate", "location", "numAliquots"];


  constructor() { }

  ngOnChanges() {
    let cols = [];
    this.data.forEach(d => cols = cols.concat(Object.keys(d)));

    if (!this.displayedColumns) {
      this.displayedColumns = Array.from(new Set(cols));
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
