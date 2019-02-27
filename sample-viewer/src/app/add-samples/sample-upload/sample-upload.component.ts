import { Component, OnInit, OnChanges } from '@angular/core';

import { ApiService } from '../../_services/api.service';

@Component({
  selector: 'app-sample-upload',
  templateUrl: './sample-upload.component.html',
  styleUrls: ['./sample-upload.component.scss']
})

// https://blog.teamtreehouse.com/reading-files-using-the-html5-filereader-api
// https://developer.mozilla.org/en-US/docs/Web/API/FileReader
export class SampleUploadComponent implements OnInit {

  constructor(private apiSvc: ApiService) { }

  ngOnInit() {
  }

  ngOnChanges() {
  }

  fileChange(event) {
    let fileList: FileList = event.target.files;

    if (fileList.length > 0) {
      let file: File = fileList[0];

      var reader = new FileReader();

      // Read in the file as a text object.
      reader.readAsText(file, 'application/json');

      // listen for the file to be loaded; then save the result.
      reader.onload = (e) => {
        let data = JSON.parse(reader.result);
        console.log(data)
        this.apiSvc.put("sample", data)

        // Clear input so can re-upload the same file.
        document.getElementById("file_uploader")['value'] = "";
      }
    }

  }
}
