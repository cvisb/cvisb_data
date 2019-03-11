import { Component, OnInit, OnChanges } from '@angular/core';

// import { ApiService, AuthService, GetPatientsService, CheckIdsService } from '../../_services/';
import { ApiService, AuthService, GetPatientsService, } from '../../_services/';

import { CvisbUser } from '../../_models';

import { nest } from 'd3';
import * as _ from 'lodash';


@Component({
  selector: 'app-patient-upload',
  templateUrl: './patient-upload.component.html',
  styleUrls: ['./patient-upload.component.scss']
})
export class PatientUploadComponent implements OnInit {
  user: CvisbUser;
  fileType: string;
  uploadResponse: string;
  errorMsg: string;
  errorObj: Object[];
  badIDs: Object[];
  dateDict: Object[];
  missingReq: Object[];
  previewData: Object[];
  dataLength: number;

  constructor(
    private apiSvc: ApiService,
    private authSvc: AuthService,
    private patientSvc: GetPatientsService,
    // private idSvc: CheckIdsService,
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

    // Clear previous states
    this.errorMsg = null;
    this.errorObj = null;

    if (fileList.length > 0) {

      this.uploadResponse = "Uploading file..."

      let file: File = fileList[0];
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
        this.uploadResponse = "File uploaded. Sending data to the database..."

        let data = this.prepData(reader.result);
        console.log(data)


        let ids = data.map(d => d.privatePatientID);


        this.apiSvc.put("patient", data).subscribe(resp => {
          this.uploadResponse = `Success! ${resp}`;
          console.log(resp)
          // Call sample service to update the samples.
          this.patientSvc.getAllPatients();
        }, err => {
          this.uploadResponse = "Uh oh. Something went wrong."
          this.errorMsg = err.error.error ? err.error.error : "Dunno why-- are you logged in? Check the developer console. Sorry :("

          this.errorObj = err.error.error_list;

          if (this.errorObj) {
            this.errorObj = this.tidyBackendErrors(this.errorObj)
            console.log(this.errorObj)
          }
          console.log(err)
        });

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
        d['location.updatedBy'] = this.user.name;

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

    let filtered = _.cloneDeep(data);
    // let filtered = (data);

    filtered.forEach(d => delete (d.sampleID));

    filtered = filtered.filter(d => Object.values(d).some(value => value !== ""));

    return (filtered)
  }


  tidyBackendErrors(error_array) {
    let errs = [];

    // Reformat the errors
    error_array.forEach(document => document.error_messages.forEach(
      msg => errs.push({
        message: msg.split("\n").filter((d, i) => i === 0 || i === 2),
        id: document.input_obj.patientID,
        input: document.input_obj
      })))
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
