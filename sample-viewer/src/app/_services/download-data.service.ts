import { Injectable } from '@angular/core';

// --- pipes ---
import { DatePipe } from '@angular/common';

// --- services ---
import { AuthService } from './auth.service';
import { RequestParametersService } from './request-parameters.service';
import { GetPatientsService } from './get-patients.service';
import { Nested2longService } from './nested2long.service';

// --- models ---
import { AuthState, RequestParamArray, Patient } from '../_models';
import { HttpParams } from '@angular/common/http';

// --- functions ---
import { uniq, flatMapDeep } from 'lodash';

// --- Dialog box ---
import { MatDialog, MatDialogRef } from '@angular/material';
import { SpinnerPopupComponent } from '../_dialogs';

@Injectable({
  providedIn: 'root'
})

export class DownloadDataService {
  filename: string;
  auth_stub: string;
  today: string;
  dialogRef: MatDialogRef<any>;
  qParamArray: RequestParamArray;
  qParams: HttpParams;
  sampleSortCols: string[] = ["sampleID", "creatorInitials", "sampleLabel", "sampleType", "isolationDate", "lab", "numAliquots"];

  constructor(
    private authSvc: AuthService,
    private datePipe: DatePipe,
    public dialog: MatDialog,
    private requestSvc: RequestParametersService,
    private patientSvc: GetPatientsService,
    private longSvc: Nested2longService,
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
      // console.log(qParams)
    })
  }

  // Exterior function to call download, trigger dialog popup
  triggerDownload(filetype: string, data: any[]) {
    this.dialogRef = this.dialog.open(SpinnerPopupComponent, {
      width: '300px',
      data: `downloading data for selected ${filetype}...`,
      disableClose: true
    });

    this.downloadData(filetype, data);
  }


  // Main switch function to call the downloading of data
  downloadData(filetype: string, data: any[]) {
    switch (filetype) {
      // --- patients ---
      case ("patients"):
        this.filename = `${this.today}_cvisb_${filetype}${this.auth_stub}.tsv`;

        this.patientSvc.fetchAll(this.qParams).subscribe((patients: Patient[]) => {
          data = patients;
          this.parseData(patients, filetype, this.filename);
        });
        break;

      // --- samples ---
      case ("samples"):
        this.filename = `${this.today}_cvisb_${filetype}${this.auth_stub}.tsv`;
        data = this.longSvc.prep4download(data, ['location'], ['_score', '_version', '_id']);

        // sort of a hack; since location data is nested in the ES index, it will return *all* samples, regardless of location
        // If location is selected, filter the data to remove the offending locations.
        let labs = this.qParamArray.filter(d => d.field === "location.lab");

        if (labs.length === 1) {
          labs = labs[0].value;
          data = data.filter(d => labs.includes(d.lab))
        }
        this.parseData(data, filetype, this.filename);
        break;

      // --- Viral sequencing ---
      case ("viral sequences"):
        // this.filename = `${this.today}_cvisb_${this.filenamePart}-viral-sequences`;
        this.downloadFasta(data, filetype, this.filename);
        break;
      default:
        this.parseData(data, filetype, `${this.today}_cvisb_data${this.auth_stub}.tsv`);
        break;
    }
  }

  saveData(dwnld_data: string, filename: string) {
    var blob = new Blob([dwnld_data], { type: 'text/csv' });
    var hiddenElement = document.createElement('a');
    hiddenElement.href = window.URL.createObjectURL(blob);
    // hiddenElement.href = 'data:text/tsv;charset=utf-8,' + encodeURI(dwnld_data);
    hiddenElement.target = '_blank';
    hiddenElement.download = filename;
    // Gotta actually append the hidden element to the DOM for the click to work in Firefox
    // https://support.mozilla.org/en-US/questions/968992
    document.body.appendChild(hiddenElement);
    hiddenElement.click();
    this.dialogRef.close();
  }

  // data ==> string
  parseData(data: any[], filetype: string, filename: string) {
    const columnDelimiter = '\t'; // technically, tab-separated, since some things have commas in names.
    const lineDelimiter = '\n';

    if (data && data.length > 0) {
      let colnames = uniq(flatMapDeep(data, d => Object.keys(d)));

      if (filetype === "samples") {
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

  downloadFasta(data: any[], filetype: string, filename: string) {
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
    this.parseData(data, filetype, `${filename}_patient-data.tsv`);
    // this.parseData(data.patients, `${filename}-patientData.tsv`);
  }

  sortingFunc(a: string, columnOrder: string[]) {
    let idx = columnOrder.indexOf(a);
    // if not found, return dummy so sorts at the end
    if (idx < 0) {
      return (1000);
    }
    return (idx);
  }

}
