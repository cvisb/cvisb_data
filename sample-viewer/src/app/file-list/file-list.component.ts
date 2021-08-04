import { Component, OnInit, HostListener, ViewChild, Input } from '@angular/core';

import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

import { HttpParams } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { merge } from "rxjs/";

import { FileMetadataService, ApiService, DownloadsDataSource } from '../_services';

@Component({
  selector: 'app-file-list',
  templateUrl: './file-list.component.html',
  styleUrls: ['./file-list.component.scss']
})

export class FileListComponent implements OnInit {
  @Input() datasetID: string;
  @Input() patientID: string;
  @Input() experimentIDs: string[];

  // MatPaginator
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  downloads: any[];
  anything_selected: boolean;
  qParams: HttpParams;
  selectedRow;
  displayedColumns: string[] = ['name', 'additionalType', 'description', 'dateModified', 'download'];
  // displayedColumns: string[] = ['name', 'additionalType', 'dateModified', 'download', 'metadata'];
  dataSource: DownloadsDataSource;

  constructor(
    private apiSvc: ApiService,
    private mdSvc: FileMetadataService
  ) {
    mdSvc.fileClicked$.subscribe(status => {
      this.anything_selected = status;
    })
  }


  ngOnInit() {
    if (this.patientID) {
      this.qParams = new HttpParams()
        .set("q", `includedInDataset.keyword:"${this.datasetID}"`)
        .set("patientID", `"${this.patientID}"`);
    } else if(this.experimentIDs) {
      this.qParams = new HttpParams()
        .set("q", `experimentIDs:"${this.experimentIDs.join('","')}"`);
    } else {
      this.qParams = new HttpParams()
        .set("q", `includedInDataset.keyword:"${this.datasetID}"`);
    }

    this.dataSource = new DownloadsDataSource(this.apiSvc);
    this.dataSource.loadDownloads(this.qParams, 0, 5, "additionalType", "asc");
  }

  ngAfterViewInit() {
    // reset the paginator after sorting
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => this.loadDownloadList())
      )
      .subscribe();
  }

  loadDownloadList() {
    this.dataSource.loadDownloads(this.qParams, this.paginator.pageIndex, this.paginator.pageSize,
      this.sort.active, this.sort.direction);
  }

  selectFile($event: Event, selected: any) {
    // $event.preventDefault();
    // $event.stopPropagation();  // <- that will stop propagation on lower layers
    //
    // // this.metadata = selected;
    // this.mdSvc.sendMetadata(selected, "DataDownload");
    // this.mdSvc.clickFile(true);
    //
    // let file_name = selected['name'];
    // //
    // // Reset other files
    // // this.dataSource.data = this.datasetSvc.clearSelected(this.dataSource.data);
    // //
    // // Activate selected file
    // // for (let i = 0; i < this.dataSource.data.length; i++) {
    // //   let selIdx = this.dataSource.data.findIndex(d => d.name === file_name);
    // //   if (selIdx > -1) {
    // //     this.dataSource.data[selIdx]['selected'] = true;
    // //   }
    // // }
  }



  selectRow(row) {
    console.log('row selected!')
    console.log(row)
    // $event.preventDefault();
    // $event.stopPropagation();  // <- that will stop propagation on lower layers

    this.mdSvc.clickFile(true);
    this.selectedRow = row;
    this.mdSvc.sendMetadata(row, "DataDownload");

  }

  // If click outside the list, unselect all.
  @HostListener('document:click', ['$event']) clickedOutside($event) {
    this.selectedRow = null;
    if (this.anything_selected) {
      this.mdSvc.clickFile(false);
      this.mdSvc.sendMetadata(null, "");
    }
  }

}
