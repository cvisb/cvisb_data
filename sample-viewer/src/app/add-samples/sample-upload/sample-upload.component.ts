import { Component, OnInit } from '@angular/core';

import { ApiService, AuthService, SampleUploadService, GetSamplesService } from '../../_services/';

import { CvisbUser } from '../../_models';

import * as _ from 'lodash';

@Component({
  selector: 'app-sample-upload',
  templateUrl: './sample-upload.component.html',
  styleUrls: ['./sample-upload.component.scss']
})

// https://blog.teamtreehouse.com/reading-files-using-the-html5-filereader-api
// https://developer.mozilla.org/en-US/docs/Web/API/FileReader
export class SampleUploadComponent implements OnInit {
  user: CvisbUser;
  fileType: string;
  fileName: string;
  uploadResponse: string;
  errorMsg: string;

  dataLength: number;

  uploadProgress: number = 0;

  constructor(
    private apiSvc: ApiService,
    private authSvc: AuthService,
    private uploadSvc: SampleUploadService,
  ) {
    authSvc.userState$.subscribe((user: CvisbUser) => {
      this.user = user;
    })

  }

  ngOnInit() {
    this.testUploadProgressChange()
  }

  testUploadProgressChange() {
    for (let i = 0; i <= 10; i++) {
      setTimeout(() => this.uploadProgress = i * 10, 5000);
      setTimeout(() => this.uploadProgress = i * 10, 2000);
    }
  }

  fileChange(event) {
    let fileList: FileList = event.target.files;

    // Clear previous states
    this.uploadSvc.clearProgress();
    this.errorMsg = null;

    if (fileList.length > 0) {

      this.uploadResponse = "Uploading file..."

      let file: File = fileList[0];
      // console.log(file)
      this.fileName = file.name;
      this.fileType = file.type;

      switch (this.fileType) {
        case "text/csv":
          var reader = new FileReader();

          // Read in the file as a text object.
          reader.readAsText(file, this.fileType);
          // reader.readAsBinaryString(file); // For .xlsx
          break;

        case "application/json":
          var reader = new FileReader();

          // Read in the file as a text object.
          reader.readAsText(file, this.fileType);
          break;
        case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
          this.uploadResponse = "Sorry, Excel sheets aren't supported yet."
          this.errorMsg = "Save the file as a .csv and re-load.  Or buy Laura tea, pastries, and/or chocolate."
          break;
        default:
          this.uploadResponse = "Sorry, this file format isn't supported."
          this.errorMsg = "Please upload a .csv or .json file."
          break;
      }




      // listen for the file to be loaded; then save the result.
      reader.onload = (e) => {
        this.uploadResponse = "File uploaded."

        let data = this.prepData(reader.result);

        let ids = data.map(d => d.privatePatientID);

        // console.log(data)

        // Clear input so can re-upload the same file.
        document.getElementById("file_uploader")['value'] = "";
      }
    }

  }


  // Function to clean imported data into the correct format for ES upload
  prepData(datastring) {
    let data;

    switch (this.fileType) {
      case "application/json":
        try {
          data = JSON.parse(datastring);
          this.uploadSvc.updateProgress("upload", true);
          this.uploadSvc.updateValidation("delete_extra", true, 0, data);
        } catch (err) {
          this.uploadResponse = "Uh oh. The .json can't be parsed-- is the syntax wrong?"
        }
        break;
      case "text/csv":
        data = this.csvJSON(datastring)
      default:
        break;
    }



    if (data) {
      data.forEach(d => {
        // Append user name to the location change
        d['updatedBy'] = this.user.name;
      });

      this.dataLength = data.length;


      // FRONT-END VALIDATION FUNCTIONS
      // [2] check required
      this.uploadSvc.checkRequired(data);

      // [3] check IDs
      // If there are IDs that look bad, send them back for review.
      this.uploadSvc.checkIDs();

      // [4] check dates
      // Consolidate dates down for review.
      let cleaned_dates = this.uploadSvc.checkDates();


      // [5] create sample IDs
      this.uploadSvc.createSampleIDs();

      // [6] check/combine duplicates
      this.uploadSvc.checkDupes();
      this.uploadSvc.combineDupes();

      data = this.uploadSvc.getData();
      // console.log(data)

      return (data);
    }

  }

  // from https://stackoverflow.com/questions/27979002/convert-csv-data-into-json-format-using-javascript
  csvJSON(csv) {

    var lines = csv.split("\n");

    var result = [];

    // remove superfluous return character which bollocks things up
    var headers = lines[0].replace(/\r/, "").split(",");
    headers = headers.filter(d => d !== ""); // Remove empty columns

    for (var i = 1; i < lines.length; i++) {
      if (lines[i] !== "") { // skip line if just an enter / new return character
        var obj = {};
        // remove superfluous return character which bollocks things up
        var currentline = lines[i].replace(/\r/, "").split(",");


        for (var j = 0; j < headers.length; j++) {
          obj[headers[j]] = currentline[j];
        }

        result.push(obj);

      }
    }
    this.uploadSvc.updateProgress("upload", true);

    return (this.cleanCSV(result, headers));
  }

  // Remove any blank rows
  cleanCSV(data, headers) {
    return (this.removeEmpties(data, headers))
  }

  removeEmpties(data, headers) {
    headers.filter(d => d !== "sampleID");

    let filtered = _.cloneDeep(data);

    filtered.forEach(d => delete (d.sampleID));

    filtered = filtered.filter(d => Object.values(d).some(value => value !== ""));
    this.uploadSvc.updateValidation("delete_extra", true, data.length - filtered.length, filtered);

    return (filtered)
  }

  deleteSamples() {
    console.log("deleting all!  eep!")
    this.apiSvc.wipeEndpoint('sample');
  }

}
