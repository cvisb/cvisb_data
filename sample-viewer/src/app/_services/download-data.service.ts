import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

// --- pipes ---
import { DatePipe } from '@angular/common';
import { DateRangePipe } from '../_pipes/date-range.pipe';

// --- services ---
import { AuthService } from './auth.service';
import { RequestParametersService } from './request-parameters.service';
import { GetPatientsService } from './get-patients.service';
import { Nested2longService } from './nested2long.service';
import { GetExperimentsService } from './get-experiments.service';

// --- models ---
import { AuthState, RequestParamArray, Patient, PatientDownload, SystemsSerology, SerologyDownload } from '../_models';
import { HttpParams } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

// --- functions ---
import { uniq, flatMapDeep } from 'lodash';

// --- Dialog box ---
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SpinnerPopupComponent } from '../_dialogs';

@Injectable({
  providedIn: 'root'
})

export class DownloadDataService {
  auth_stub: string;
  today: string;
  dialogRef: MatDialogRef<any>;
  qParamArray: RequestParamArray;
  qParams: HttpParams;
  sampleSortCols: string[] = ["sampleID", "creatorInitials", "sampleLabel", "sampleType", "isolationDate", "lab", "numAliquots"];
  // patientSortCols: string[] = [
  //   'patientID', 'alternateIdentifier', 'cohort', 'outcome', 'gender', 'age',
  //   'country', 'admin2', 'admin3',
  //   'infectionYear', 'infectionDate', 'admitDate', 'evalDate', 'dischargeDate', 'daysInHospital', 'daysOnset',
  //   'elisa', 'citation', 'source', 'dataStatus', 'correction'];
  // seroSortCols: string[] = ["patientID", "visitCode", "sampleID", "experimentID", "batchID", "assayType", "antigenVirus", "antigen", "antigenSource", "value", "valueCategory", "valueCategoryNumeric", "experimentDate", "source", "citation", "publisher", "dataStatus", "dateModified", "correction"];

  // Loading spinner
  private loadingCompleteSubject = new BehaviorSubject<boolean>(false);
  public loadingCompleteState$ = this.loadingCompleteSubject.asObservable();

  constructor(
    private authSvc: AuthService,
    private datePipe: DatePipe,
    private dateRangePipe: DateRangePipe,
    public dialog: MatDialog,
    private requestSvc: RequestParametersService,
    private patientSvc: GetPatientsService,
    private exptSvc: GetExperimentsService,
    private longSvc: Nested2longService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.today = this.datePipe.transform(new Date(), "yyyy-MM-dd");

    this.authSvc.authState$.subscribe((authState: AuthState) => {
      // console.log(authState)
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
  triggerDownload(filetype: string, data: any[], filename?: string) {
    this.loadingCompleteSubject.next(false);
    this.dialogRef = this.dialog.open(SpinnerPopupComponent, {
      width: '535px',
      data: `Downloading selected ${filetype} data...`,
      disableClose: true
    });

    if (isPlatformBrowser(this.platformId)) {
      this.getDownloadableData(filetype, data, filename);
    }
  }


  // Main switch function to call the downloading of data
  getDownloadableData(filetype: string, data: any[], filename?: string) {
    switch (filetype) {
      // --- patients ---
      case ("patients"):
        filename = `${this.today}_cvisb_${filetype}${this.auth_stub}.tsv`;

        this.patientSvc.fetchAllPatients(this.qParams).subscribe((patients: PatientDownload[]) => {
          data = patients;
          this.parseData(patients, filetype, filename);
        });
        break;

      // --- samples ---
      case ("samples"):
        filename = `${this.today}_cvisb_${filetype}${this.auth_stub}.tsv`;
        data = this.longSvc.prep4download(data, ['location'], ['_score', '_version', '_id']);

        // sort of a hack; since location data is nested in the ES index, it will return *all* samples, regardless of location
        // If location is selected, filter the data to remove the offending locations.
        let labs = this.qParamArray.filter(d => d.field === "location.lab");

        if (labs.length === 1) {
          labs = labs[0].value;
          data = data.filter(d => labs.includes(d.lab))
        }
        this.parseData(data, filetype, filename);
        break;

      // --- Viral sequencing ---
      case ("virus sequences"):
        // this.filename = `${this.today}_cvisb_${this.filenamePart}-virus-sequences`;
        this.downloadFasta(data, filetype, filename);
        break;
      case ("systems-serology"):
        try {
          filename = filename.split("/").slice(-1)[0]
          filename = `${this.today}_${filename.replace(".csv", "")}`
        } catch (error) {
          filename = `${this.today}_CViSB-SystemsSerology`
        }

        // this.exptSvc.getExptsPatients("ebola-viral-seq").subscribe(data => {
        this.exptSvc.getExptsPatients(filetype).subscribe(data => {
          let patientData = data['patient'].map((patient: Patient) => {
            return (new PatientDownload(patient, this.dateRangePipe));
          });

          let seroData = data['experiment'].map((expt: SystemsSerology) => {
            return (new SerologyDownload(expt))
          })
          this.parseData(seroData, filetype, `${filename}${this.auth_stub}.tsv`);
          this.parseData(patientData, 'patients', `${filename}_PatientData${this.auth_stub}.tsv`);
        });

        break;
      default:
        this.parseData(data, filetype, `${this.today}_cvisb_data${this.auth_stub}.tsv`);
        break;
    }
  }

  saveData(dwnld_data: string, filename: string, encodingFormat: string) {
    // this.loadingCompleteSubject.next(true);
    if (isPlatformBrowser(this.platformId)) {
      var blob = new Blob([dwnld_data], { type: encodingFormat });
      var hiddenElement = document.createElement('a');
      hiddenElement.href = window.URL.createObjectURL(blob);
      // hiddenElement.href = 'data:text/tsv;charset=utf-8,' + encodeURI(dwnld_data);
      hiddenElement.target = '_blank';
      hiddenElement.download = filename;
      // Gotta actually append the hidden element to the DOM for the click to work in Firefox
      // https://support.mozilla.org/en-US/questions/968992
      document.body.appendChild(hiddenElement);
      hiddenElement.click();

      // this.dialogRef.close();
    }
  }

  // General function to convert an array into a tab-delimited string for download.
  parseData(data: any[], filetype: string, filename: string, columnDelimiter: string = '\t', filterBlank: boolean = true) {
    // technically, tab-separated, since some things have commas in names.
    const lineDelimiter = '\n';

    if (data && data.length > 0) {
      let colnames = uniq(flatMapDeep(data, d => Object.keys(d)));

      // sort the columns in a logical order
      if (filetype === "samples") {
        colnames.sort((a, b) => this.sortingFunc(a, this.sampleSortCols) - this.sortingFunc(b, this.sampleSortCols))
      }

      // if (filetype === "patients") {
      //   colnames.sort((a, b) => this.sortingFunc(a, this.patientSortCols) - this.sortingFunc(b, this.sampleSortCols))
      // }
      //
      // if (filetype === "systems-serology") {
      //   colnames.sort((a, b) => this.sortingFunc(a, this.seroSortCols) - this.sortingFunc(b, this.sampleSortCols))
      // }

      //  Remove columns where all the info is blank:
      if (filterBlank) {
        colnames = this.removeBlanks(data, colnames);
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

      let encodingFormat: string;
      switch (columnDelimiter) {
        case ("\t"):
          encodingFormat = "text/tab-separated-values";
          break;
        case (","):
          encodingFormat = "text/csv";
          break;
        default:
          encodingFormat = "text/csv";
          break;
      }
      this.saveData(dwnld_data, filename, encodingFormat);
    }
  }

  downloadFasta(data: any[], filetype: string, filename: string) {
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
    this.saveData(dwnld_data, `${filename}.fasta`, "text/fasta");    // patient metadata
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

  removeBlanks(data: Object[], colnames: string[]) {
    let nonzeroCols = []
    colnames.forEach(column => {
      if (data.some(d => d[column])) {
        nonzeroCols.push(column)
      }
    })
    return (nonzeroCols)
  }

}
