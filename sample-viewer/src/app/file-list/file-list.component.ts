import { Component, OnInit, HostListener, ViewChild, Input } from '@angular/core';

import { MatPaginator, MatSort, MatTableDataSource, MatSortable } from '@angular/material';

import { HttpParams } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { merge } from "rxjs/";

import { getDatasetsService, FileMetadataService, ApiService, DownloadsDataSource } from '../_services';

@Component({
  selector: 'app-file-list',
  templateUrl: './file-list.component.html',
  styleUrls: ['./file-list.component.scss']
})

export class FileListComponent implements OnInit {
  @Input() datasetID: string;
  @Input() patientID: string;

  // MatPaginator
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  measurementTechnique: string;
  downloads: any[];
  anything_selected: boolean;
  qParams: HttpParams;
  selectedRow;
  displayedColumns: string[] = ['name', 'additionalType', 'dateModified', 'download', 'metadata'];
  dataSource: DownloadsDataSource;

  id2MeasurementTechnique: Object = {
    'hla': 'HLA sequencing',
    'viralseq': 'viral sequencing',
    'systemsserology': 'Systems Serology',
    'metagenomeseq': 'metagenome sequencing',
    'bcr': 'BCR sequencing',
    'tcr': 'TCR sequencing',
    'metabolomics': "metabolomics"
  };

  constructor(
    private apiSvc: ApiService,
    private datasetSvc: getDatasetsService,
    private mdSvc: FileMetadataService
  ) {
    mdSvc.fileClicked$.subscribe(status => {
      this.anything_selected = status;
    })
  }


  ngOnInit() {
    this.measurementTechnique = this.id2MeasurementTechnique[this.datasetID];
    console.log(this.measurementTechnique)

    if (this.patientID) {
      this.qParams = new HttpParams()
        .set("q", `measurementTechnique:"${this.measurementTechnique}"`)
        .set("patientID", `"${this.patientID}"`);
    } else {
      this.qParams = new HttpParams()
        .set("q", `measurementTechnique:"${this.measurementTechnique}"`);
    }

    this.dataSource = new DownloadsDataSource(this.apiSvc);
    this.dataSource.loadDownloads(this.qParams, 0, 5, "additionalType", "desc");
  }

  ngAfterViewInit() {
    // set initial conditions
    this.sort.sort(<MatSortable>{
      id: 'additionalType',
      start: 'desc'
    }
    );
    // this.sort.active = "additionalType";
    // this.sort.direction = "desc";

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
