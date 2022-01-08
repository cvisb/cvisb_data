import { Component, OnDestroy } from '@angular/core';

import { ApiService, AuthService, GetPatientsService } from '../../_services/';

import { CvisbUser } from '../../_models';
import { Subscription } from "rxjs";

import { cloneDeep } from 'lodash';

@Component({
  selector: 'app-data-upload',
  templateUrl: './data-upload.component.html',
  styleUrls: ['./data-upload.component.scss']
})
export class DataUploadComponent implements OnDestroy {
  user: CvisbUser;
  fileType: string;
  uploadResponse: string;
  uploadProgress: number;
  errorMsg: string;
  errorObj: Object[];
  badIDs: Object[];
  dateDict: Object[];
  missingReq: Object[];
  previewData: Object[];
  data2upload: Object[];
  newIDs: String[];
  replacementIDs: String[];
  dupes: String[];
  uploadSize: number;
  dataLength: number;
  fileKB: number;
  uploading: Boolean = false;
  maxUploadKB: number = 50; // actually 1 MB, but I want them to all resolve within 1 min.
  loading: boolean = false;
  loadingSubscription: Subscription;
  progressSubscription: Subscription;
  userSubscription: Subscription;

  endpoint: string;

  constructor(
    private apiSvc: ApiService,
    private authSvc: AuthService,
    private patientSvc: GetPatientsService,
    // private idSvc: CheckIdsService,
  ) {
    this.userSubscription = this.authSvc.userState$.subscribe((user: CvisbUser) => {
      this.user = user;
    })

    this.progressSubscription = this.apiSvc.uploadProgressState$.subscribe((progress: number) => {
      this.uploadProgress = progress;
    })

    this.loadingSubscription = this.apiSvc.loadingState$.subscribe(loading => {
      this.loading = loading
    })

  }

  ngOnDestroy() {
    this.loadingSubscription.unsubscribe();
    this.progressSubscription.unsubscribe();
    this.userSubscription.unsubscribe();
  }

  deletePatients() {
    console.log(`deleting all in ${this.endpoint}!  eep!`)
    this.apiSvc.wipeEndpoint(this.endpoint);
  }

  fileChange(event) {
    let fileList: FileList = event.target.files;

    // Clear previous states
    this.errorMsg = null;
    this.errorObj = null;
    this.uploadProgress = 0;
    this.uploading = false;
    this.dupes = [];
    this.newIDs = [];
    this.replacementIDs = [];

    if (fileList.length > 0) {

      this.uploadResponse = "Uploading file..."

      let file: File = fileList[0];
      this.fileKB = file.size / 1000;
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
        this.uploadResponse = "File uploaded; checking if the records already exist in the database.";

        this.data2upload = this.prepData(reader.result);


        this.uploadSize = Math.floor((this.dataLength / this.fileKB) * this.maxUploadKB);
        // double check upload size is greater than 0.
        this.uploadSize = this.uploadSize === 0 ? 1 : this.uploadSize;

        var uniqueID: string;

        switch (this.endpoint) {
          case "experiment":
            uniqueID = "experimentID";
            break;
          case "dataset":
            uniqueID = "identifier";
            break;
          case "datadownload":
            uniqueID = "identifier";
            break;
          case "datacatalog":
            uniqueID = "identifier";
            break;
        }

        this.apiSvc.prepUpload(this.endpoint, uniqueID, this.data2upload).subscribe(dupes => {
          this.uploadResponse = "Review the new and replacement IDs and then upload";
          dupes.sort((a, b) => a < b ? -1 : 1);
          this.dupes = dupes;
          this.replacementIDs = this.data2upload.filter(d => d["_id"]).map(d => d[uniqueID]);
          this.replacementIDs.sort((a, b) => a < b ? -1 : 1);
          this.newIDs = this.data2upload.filter(d => !d["_id"]).map(d => d[uniqueID]);
          this.newIDs.sort((a, b) => a < b ? -1 : 1);
        })

        // this.apiSvc.putPiecewise(this.endpoint, this.data2upload, uploadSize).subscribe(
        //   responses => {
        //     console.log(responses)
        //
        //     let result = this.apiSvc.tidyPutResponse(responses, this.dataLength, this.endpoint + "s");
        //
        //     this.uploadResponse = result.uploadResponse;
        //     this.errorMsg = result.errorMsg;
        //     this.errorObj = result.errorObj;
        //   })

        // Clear input so can re-upload the same file.
        document.getElementById("file_uploader")['value'] = "";
      }
    }

  }

  uploadData() {
    this.uploading = true;
    // console.log(this.data2upload);
    this.uploadResponse = "Sending data to the database.  Be patient! This can take a few minutes";
    this.apiSvc.putPiecewise(this.endpoint, this.data2upload, this.uploadSize).subscribe(
      responses => {
        // console.log(responses)

        let result = this.apiSvc.tidyPutResponse(responses, this.dataLength, this.endpoint + "s");

        this.uploadResponse = result.uploadResponse;
        this.errorMsg = result.errorMsg;
        this.errorObj = result.errorObj;
      })
  }



  // Function to clean imported data into the correct format for ES upload
  prepData(datastring) {
    let data;

    switch (this.fileType) {
      case "application/json":
        data = JSON.parse(datastring);
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

        // Check if the IDs are correct
        if (d.privatePatientID) {
          // d['id_check'] = this.idSvc.checkPatientID(d.privatePatientID);
          // d['id_okay'] = d.id_check['id'] === d.privatePatientID;
        }
      });

      this.dataLength = data.length;

      console.log(data)
      this.previewData = data;

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
    // return ((result));
    return (this.cleanCSV(result, headers));
  }

  // Remove any blank rows
  cleanCSV(data, headers) {
    return (this.removeEmpties(data, headers))
  }

  removeEmpties(data, headers) {
    headers.filter(d => d !== "patientID");

    let filtered = cloneDeep(data);
    // let filtered = (data);

    filtered.forEach(d => delete (d.sampleID));

    filtered = filtered.filter(d => Object.values(d).some(value => value !== ""));

    return (filtered)
  }
}
