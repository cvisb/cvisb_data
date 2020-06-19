import { Component, OnInit, OnChanges } from '@angular/core';

// import { ApiService, AuthService, GetPatientsService, CheckIdsService } from '../../_services/';
import { ApiService, AuthService, GetPatientsService, } from '../../_services/';

import { CvisbUser } from '../../_models';


import { cloneDeep } from 'lodash';


@Component({
  selector: 'app-patient-upload',
  templateUrl: './patient-upload.component.html',
  styleUrls: ['./patient-upload.component.scss']
})
export class PatientUploadComponent implements OnInit {
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
  uploadSize: number;
  dataLength: number;
  fileKB: number;
  maxUploadKB: number = 50; // actually 1 MB, but I want them to all resolve within 1 min.

  constructor(
    private apiSvc: ApiService,
    private authSvc: AuthService,
    private patientSvc: GetPatientsService,
    // private idSvc: CheckIdsService,
  ) {
    authSvc.userState$.subscribe((user: CvisbUser) => {
      this.user = user;
    })

    apiSvc.uploadProgressState$.subscribe((progress: number) => {
      this.uploadProgress = progress;
    })

  }

  ngOnInit() {
  }

  ngOnChanges() {
  }

  deletePatients() {
    console.log("deleting all!  eep!")
    this.apiSvc.wipeEndpoint('patient');
  }

  fileChange(event) {
    let fileList: FileList = event.target.files;

    // Clear previous states
    this.errorMsg = null;
    this.errorObj = null;
    this.uploadProgress = 0;

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
        this.uploadResponse = "File uploaded; review and then upload";

        this.data2upload = this.prepData(reader.result);
        console.log(this.data2upload )

        this.uploadSize = Math.floor((this.dataLength / this.fileKB) * this.maxUploadKB);
        // double check upload size is greater than 0.
        this.uploadSize = this.uploadSize === 0 ? 1 : this.uploadSize;

        this.apiSvc.prepUpload("patient", "patientID", this.data2upload).subscribe(responses => {
          console.log(responses)
        })
        // Clear input so can re-upload the same file.
        document.getElementById("file_uploader")['value'] = "";
      }
    }

  }

  uploadData(){
    console.log(this.data2upload);
    this.uploadResponse = "Sending data to the database.  Be patient! This can take a few minutes";
    this.apiSvc.putPiecewise("patient", this.data2upload, this.uploadSize).subscribe(
      responses => {
        console.log(responses)

        let result = this.apiSvc.tidyPutResponse(responses, this.dataLength, 'patients');

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

      // console.log(data)
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
