import { Component, OnInit, OnChanges } from '@angular/core';

import { ApiService, AuthService } from '../../_services/';

import { CvisbUser } from '../../_models';

import { nest } from 'd3';

@Component({
  selector: 'app-sample-upload',
  templateUrl: './sample-upload.component.html',
  styleUrls: ['./sample-upload.component.scss']
})

// https://blog.teamtreehouse.com/reading-files-using-the-html5-filereader-api
// https://developer.mozilla.org/en-US/docs/Web/API/FileReader
export class SampleUploadComponent implements OnInit {
  user: CvisbUser;
  uploadResponse: string;
  errorMsg: string;
  errorObj: Object[];

  constructor(
    private apiSvc: ApiService,
    private authSvc: AuthService
  ) {
    authSvc.userState$.subscribe((user: CvisbUser) => {
      this.user = user;
    })
  }

  ngOnInit() {
  }

  ngOnChanges() {
  }

  fileChange(event) {
    let fileList: FileList = event.target.files;

    if (fileList.length > 0) {
      this.uploadResponse = "Uploading file..."
      let file: File = fileList[0];

      var reader = new FileReader();

      // Read in the file as a text object.
      reader.readAsText(file, 'application/json');

      // listen for the file to be loaded; then save the result.
      reader.onload = (e) => {
        this.uploadResponse = "File uploaded. Sending data to the database..."
        let data = JSON.parse(reader.result);
        data.forEach(d => d['location.updatedBy'] = this.user.name)

        console.log(data)

        this.apiSvc.put("sample", data).subscribe(resp => {
          this.uploadResponse = `Success! ${resp}`;
          console.log(resp)
        }, err => {
          this.uploadResponse = "Uh oh. Something went wrong."
          this.errorMsg = err.error.error ? err.error.error : "Dunno why-- are you logged in? Check the developer console. Sorry :("

          this.errorObj = err.error.error_list;

          if (this.errorObj) {
            this.errorObj = this.tidyErrors(this.errorObj)
            console.log(this.errorObj)
          }
          console.log(err)
        });

        // Clear input so can re-upload the same file.
        document.getElementById("file_uploader")['value'] = "";
      }
    }

  }

  tidyErrors(error_array) {
    let errs = [];

    // Reformat the errors
    error_array.forEach(document => document.error_messages.forEach(msg => errs.push({ message: msg.split("\n")[0], id: document.input_obj.sampleID, input: document.input_obj })))
    console.log(errs)

    // Group by error type
    let nested = nest()
      .key((d: any) => d.message)
      .rollup(function(values: any): any {
        return {
          count: values.length,
          ids: values.map(x => x.id),
          inputs: values.map(x => x.input)
        }
      }).entries(errs);

    console.log(nested)

    return (nested)
  }
}
