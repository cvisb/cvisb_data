import { Component, OnInit, HostListener, ViewChild, Input } from '@angular/core';

import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

import { HttpParams } from '@angular/common/http';

import { getDatasetsService, FileMetadataService, ApiService } from '../../_services';

@Component({
  selector: 'app-file-list',
  templateUrl: './file-list.component.html',
  styleUrls: ['./file-list.component.scss']
})

export class FileListComponent implements OnInit {
  @Input() datasetID: string;
  measurementTechnique: string;
  downloads: any[];
  file_list: MatTableDataSource<any>;
  anything_selected: boolean;

  selectedRow;

  // MatPaginator
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = ['name', 'additionalType', 'dateModified', 'download'];
  dataSource: MatTableDataSource<any>;

  id2MeasurementTechnique: Object = {'hla': 'HLA sequencing', 'viralseq': 'viral sequencing'};

  constructor(
    private apiSvc: ApiService,
    private datasetSvc: getDatasetsService,
    private mdSvc: FileMetadataService) {
    mdSvc.fileClicked$.subscribe(status => {
      this.anything_selected = status;
    })
  }


  ngOnInit() {
    this.measurementTechnique = this.id2MeasurementTechnique[this.datasetID];
    console.log(this.measurementTechnique);

    this.apiSvc.getPaginated("datadownload", new HttpParams().set("q", `measurementTechnique:${this.measurementTechnique}`)).subscribe(files => {
      console.log(files);
      this.downloads = files['hits'];
      this.dataSource = new MatTableDataSource(this.downloads);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })

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



  selectRow($event, row) {
    $event.preventDefault();
    $event.stopPropagation();  // <- that will stop propagation on lower layers

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
