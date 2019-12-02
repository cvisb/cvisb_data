import { Component, Input } from '@angular/core';

import { DownloadDataService } from '../_services';

@Component({
  selector: 'app-download-btn',
  templateUrl: './download-btn.component.html',
  styleUrls: ['./download-btn.component.scss']
})

export class DownloadBtnComponent {
  @Input() data: any;
  @Input() filetype: string;
  @Input() buttonLabel: string;

  constructor(private downloadSvc: DownloadDataService) {
  }

  download() {
    this.downloadSvc.triggerDownload(this.filetype, this.data)
  }

}
