import { Component, OnChanges, Input, ViewChild } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

import { uniq, flatMap } from 'lodash';

@Component({
  selector: 'app-check-dupes',
  templateUrl: './check-dupes.component.html',
  styleUrls: ['./check-dupes.component.scss']
})

export class CheckDupesComponent implements OnChanges {

  @Input() data: Object[];
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = ["sampleID", "disagreements", "samples"];
  flatColumns: string[];
  sampleColumns: string[];
  // = [
  //   "sampleLabel", "privatePatientID", "visitCode", "sampleType", "isolationDate", "alternateIdentifier",
  //   "sourceSampleID", "sourceSampleType", "primarySampleDate", "protocolVersion",
  //   "protocolURL", "freezingBuffer", "dilutionFactor", "AVLinactivated",
  //   "updatedBy"];

  constructor() { }

  ngOnChanges() {
    // Filter out the non-sample columns; these are all flat objects which can be displayed within a loop in the table
    this.flatColumns = this.displayedColumns.filter(d => !["samples", "disagreements"].includes(d));

    this.sampleColumns =  uniq(flatMap(flatMap(this.data, 'samples'), Object.keys));

    this.dataSource = new MatTableDataSource(this.data);
    this.dataSource.paginator = this.paginator;

    this.dataSource.sort = this.sort;
  }

}
