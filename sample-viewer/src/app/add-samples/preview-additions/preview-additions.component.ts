import { Component, OnInit } from '@angular/core';

import { SampleUploadService } from '../../_services';

@Component({
  selector: 'app-preview-additions',
  templateUrl: './preview-additions.component.html',
  styleUrls: ['./preview-additions.component.scss']
})

export class PreviewAdditionsComponent implements OnInit {

  previewData: Object[];

  constructor(uploadSvc: SampleUploadService) {
    uploadSvc.uploadSamplesState$.subscribe(merged => {

    this.previewData = merged.filter((d:any) => d._merge === "right_only");
    console.log('upload samples changed:');
    console.log(merged);
  })

   }

  ngOnInit() {
  }

}
