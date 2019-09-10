import { Component, OnInit, Input } from '@angular/core';
import { DatePipe } from '@angular/common';

import { AuthService, GetPatientsService, RequestParametersService, Nested2longService } from '../_services';
import { AuthState, RequestParamArray } from '../_models';

import { HttpParams } from '@angular/common/http';

import { MatDialog, MatDialogRef } from '@angular/material';
import { SpinnerPopupComponent } from '../_dialogs';

import { uniq } from 'lodash';

@Component({
  selector: 'app-download-btn',
  templateUrl: './download-btn.component.html',
  styleUrls: ['./download-btn.component.scss']
})

export class DownloadBtnComponent implements OnInit {
  @Input() data: any;
  @Input() filetype: string;
  @Input() filenamePart: string;
  @Input() buttonLabel: string;
  filename: string;
  auth_stub: string;
  today: string;
  qParamArray: RequestParamArray;
  qParams: HttpParams;

  dialogRef: MatDialogRef<any>;

  sampleSortCols: string[] = ["sampleID", "creatorInitials", "sampleLabel", "sampleType", "isolationDate", "lab", "numAliquots"];

  constructor(
    private authSvc: AuthService,
    private requestSvc: RequestParametersService,
    private patientSvc: GetPatientsService,
    private datePipe: DatePipe,
    private longSvc: Nested2longService,
    public dialog: MatDialog,
  ) {
    this.today = this.datePipe.transform(new Date(), "yyyy-MM-dd");

    this.authSvc.authState$.subscribe((authState: AuthState) => {
      this.auth_stub = authState.authorized ? "_PRIVATE" : "";
    })

    requestSvc.patientParamsState$.subscribe((qParams: RequestParamArray) => {
      this.qParams = this.requestSvc.reducePatientParams(qParams);
      // console.log(this.qParams)
    })

    requestSvc.sampleParamsState$.subscribe((qParams: RequestParamArray) => {
      this.qParamArray = qParams;
      console.log(qParams)
    })
  }

  ngOnInit() {
  }

  download() {
    this.dialogRef = this.dialog.open(SpinnerPopupComponent, {
      width: '300px',
      data: `downloading data for selected ${this.filetype}...`,
      disableClose: true
    });

    this.downloadData();
  }

  parseData(data, filename) {
    const columnDelimiter = '\t'; // technically, tab-separated, since some things have commas in names.
    const lineDelimiter = '\n';

    if (data && data.length > 0) {
      let colnames = uniq(data.map(d => Object.keys(d)).flat());

      if (this.filetype === "samples") {
        colnames.sort((a, b) => this.sortingFunc(a, this.sampleSortCols) - this.sortingFunc(b, this.sampleSortCols))
      }

      var dwnld_data = '';
      dwnld_data += colnames.join(columnDelimiter);
      dwnld_data += lineDelimiter;

      data.forEach(function(item) {
        let counter = 0;
        colnames.forEach(function(key) {
          if (counter > 0) dwnld_data += columnDelimiter;

          // For null values, return empty string.
          dwnld_data += (item[key] || item[key] === 0 || item[key] === false) ? item[key] : "";
          counter++;
        });
        dwnld_data += lineDelimiter;
      });

      this.saveData(dwnld_data, filename);
    }
  }

  saveData(dwnld_data, filename: string) {
    var hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:text/tsv;charset=utf-8,' + encodeURI(dwnld_data);
    hiddenElement.target = '_blank';
    hiddenElement.download = filename;
    // Gotta actually append the hidden element to the DOM for the click to work in Firefox
    // https://support.mozilla.org/en-US/questions/968992
    document.body.appendChild(hiddenElement);
    hiddenElement.click();
    this.dialogRef.close();
  }


  downloadFasta(data, filename) {
    console.log(data)
    let seqdata = data;
    let dwnld_data = "";
    let lineDelimiter = "\n";

    seqdata.forEach(d => {
      dwnld_data += ">" + d.name;
      dwnld_data += lineDelimiter;
      dwnld_data += d.seq;
      dwnld_data += lineDelimiter;
    })

    // Sequences in .fasta format
    this.saveData(dwnld_data, `${filename}.fasta`);
    // patient metadata
    this.parseData(data, `${filename}_patient-data.tsv`);
    // this.parseData(data.patients, `${filename}-patientData.tsv`);
  }

  downloadData() {
    switch (this.filetype) {
      case ("patients"):
        this.filename = `${this.today}_cvisb_${this.filetype}${this.auth_stub}.tsv`;

        this.patientSvc.getAllPeople(this.qParams).subscribe(patients => {
          console.log("patients subscribing")
          console.log(patients)
          this.data = patients;
          this.parseData(patients, this.filename);
        });

        // this.patientSvc.getPatientRoster(this.qParams).subscribe(patients => {
        //   this.data = patients;
        //   this.parseData(patients, this.filename);
        // });
        break;
      case ("samples"):
        this.filename = `${this.today}_cvisb_${this.filetype}${this.auth_stub}.tsv`;
        this.data = this.longSvc.prep4download(this.data, ['location'], ['_score', '_version', '_id']);

        // sort of a hack; since location data is nested in the ES index, it will return *all* samples, regardless of location
        // If location is selected, filter the data to remove the offending locations.
        let labs = this.qParamArray.filter(d => d.field === "location.lab");

        if (labs.length === 1) {
          labs = labs[0].value;
          this.data = this.data.filter(d => labs.includes(d.lab))
        }

        this.parseData(this.data, this.filename);
        break;
      case ("viral sequences"):
        this.filename = `${this.today}_cvisb_${this.filenamePart}-viral-sequences`;
        this.downloadFasta(this.data, this.filename);
        break;
      default:
        this.parseData(this.data, `${this.today}_cvisb_data${this.auth_stub}.tsv`);
        break;
    }
  }

  sortingFunc(a, columnOrder) {
    let idx = columnOrder.indexOf(a);
    // if not found, return dummy so sorts at the end
    if (idx < 0) {
      return (1000);
    }
    return (idx);
  }


}
