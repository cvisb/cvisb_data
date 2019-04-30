import { Component, OnInit, ViewChild } from '@angular/core';

import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

import { SampleUploadService } from '../../_services';

@Component({
  selector: 'app-preview-differences',
  templateUrl: './preview-differences.component.html',
  styleUrls: ['./preview-differences.component.scss']
})
export class PreviewDifferencesComponent implements OnInit {
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[];
  locationColumns: string[];
  errorMsg: string;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private uploadSvc: SampleUploadService) {
    uploadSvc.previewDifferencesState$.subscribe((mergedObj: any) => {

      let merged = mergedObj.merged;
      this.displayedColumns = mergedObj.displayedColumns;
      this.locationColumns = mergedObj.locationColumns;

      this.dataSource = new MatTableDataSource(merged.filter(d => d._merge === "both"));
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })

  }

  ngOnInit() {


  }

}
