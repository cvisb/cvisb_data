import { Component, OnInit, Input } from '@angular/core';

import { ApiService } from '../../_services';
import { nest } from 'd3';

import { cloneDeep } from 'lodash';

@Component({
  selector: 'app-submit-samples',
  templateUrl: './submit-samples.component.html',
  styleUrls: ['./submit-samples.component.scss']
})

export class SubmitSamplesComponent implements OnInit {
  uploadResponse: string;
  errorMsg: string;
  errorObj: Object[];
  @Input() data: Object[];

  uploadProgress: number = 0;

  constructor(private apiSvc: ApiService, ) {
    apiSvc.uploadProgressState$.subscribe((progress: number) => {
      this.uploadProgress = progress;
    })
  }

  ngOnInit() {
  }

  ngOnChanges() {
    this.uploadResponse = "";
    this.errorMsg = "";
    this.errorObj = null;
    this.uploadProgress = 0;
  }

  submitData() {
    this.uploadProgress = 0.01;
    if (this.data.length > 0) {
      this.uploadResponse = "Attempting to submit data to database. Be patient-- this can take a few minutes.";

      // Before uploading the data, create a copy and get rid of the _merge variables used internally.
      let data2upload = cloneDeep(this.data);

      data2upload.forEach(d => {
        delete d['_merge'];

        d['location'].forEach(loc => {
          delete loc._merge;
        })
      })

      console.log('data to submit:')
      console.log(data2upload)

      this.apiSvc.putPiecewise("sample", data2upload).subscribe(
        responses => {
          console.log(responses)

          let result = this.apiSvc.tidyPutResponse(responses, data2upload.length, "samples");

          this.uploadResponse = result.uploadResponse;
          this.errorMsg = result.errorMsg;
          this.errorObj = result.errorObj;
        })
    } else {
      console.log("no data to submit!")
    }
  }

}
