import { Component, OnInit, Input, ViewChild } from '@angular/core';

import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-check-dupes',
  templateUrl: './check-dupes.component.html',
  styleUrls: ['./check-dupes.component.scss']
})

export class CheckDupesComponent implements OnInit {

  @Input() data: Object[];
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = ["sampleID", "location", "totalAliquots", "samples"];
  flatColumns: string[];
  sampleColumns: string[] = [
    "numAliquots", "sampleLabel", "privatePatientID", "visitCode", "sampleType", "isolationDate", "alternateIdentifier",
    "sourceSampleID", "sourceSampleType", "primarySampleDate", "protocolVersion",
    "protocolURL", "freezingBuffer", "dilutionFactor", "AVLinactivated",
    "freezerID", "freezerRack", "freezerBox", "freezerBoxCell", "updatedBy"];

  constructor() { }

  ngOnInit() {
    // Filter out the non-sample columns; these are all flat objects which can be displayed within a loop in the table
    this.flatColumns = this.displayedColumns.filter(d => d !== "samples");

    this.dataSource = new MatTableDataSource(this.data);
    this.dataSource.paginator = this.paginator;

    this.dataSource.sort = this.sort;
  }

}
