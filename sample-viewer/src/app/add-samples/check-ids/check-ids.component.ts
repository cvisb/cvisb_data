import { Component, OnChanges, Input, ViewChild } from '@angular/core';

import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-check-ids',
  templateUrl: './check-ids.component.html',
  styleUrls: ['./check-ids.component.scss']
})

export class CheckIdsComponent implements OnChanges {
  @Input() data: Object[];
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = ['originalID', 'id_check.id', 'id_check.timepoint', 'originalVisitCode', 'visitCodeDisagree', 'id_check.message'];

  constructor() { }

  ngOnChanges() {
    // Sort so the most missing-est data is returned first.
    this.data.sort((a: any, b: any) => a.id_check.status > b.id_check.status ? -1 : 1);
    this.dataSource = new MatTableDataSource(this.data);
    this.dataSource.paginator = this.paginator;

    this.dataSource.sort = this.sort;
  }

}
