import { Component, OnInit, Input } from '@angular/core';

import { DownloadDataService } from '../_services';

import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-download-data',
  templateUrl: './download-data.component.html',
  styleUrls: ['./download-data.component.scss']
})

export class DownloadDataComponent implements OnInit {
  @Input() filetype: string;
  @Input() filename: string;
  @Input() data: any[];

  constructor(
    private route: ActivatedRoute,
    private downloadSvc: DownloadDataService) {
    this.downloadSvc.loadingCompleteState$.subscribe((isDone:Boolean) => {
      if(isDone){
        // window.top.close();
      }
    })
  }

  ngOnInit() {
    if(this.route.snapshot.data.dsid) {
      this.filetype = this.route.snapshot.data.dsid;
      this.filename = this.route.snapshot['_routerState']['url'];
    }
    this.saveData();
  }

  saveData() {
    this.downloadSvc.triggerDownload(this.filetype, this.data, this.filename)
  }

}
