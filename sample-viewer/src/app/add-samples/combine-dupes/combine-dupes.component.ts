import { Component, OnChanges, Input, ViewChild } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-combine-dupes',
  templateUrl: './combine-dupes.component.html',
  styleUrls: ['./combine-dupes.component.scss']
})

export class CombineDupesComponent implements OnChanges {

  @Input() data: Object[];
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = ["sampleID", "lab", "totalAliquots", "samples"];
  flatColumns: string[];
  sampleColumns: string[] = [
    "numAliquots", "sampleLabel", "privatePatientID", "visitCode", "sampleType", "isolationDate", "alternateIdentifier",
    "sourceSampleID", "sourceSampleType", "primarySampleDate", "protocolVersion",
    "protocolURL", "freezingBuffer", "dilutionFactor", "AVLinactivated",
    "freezerID", "freezerRack", "freezerBox", "freezerBoxCell", "updatedBy"];

  constructor() { }

  ngOnChanges() {
    // Filter out the non-sample columns; these are all flat objects which can be displayed within a loop in the table
    this.flatColumns = this.displayedColumns.filter(d => d !== "samples");

    this.dataSource = new MatTableDataSource(this.data);
    this.dataSource.paginator = this.paginator;

    this.dataSource.sort = this.sort;
  }

}
