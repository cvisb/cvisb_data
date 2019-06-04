import { Component, OnInit, Input } from '@angular/core';
import { DatePipe } from '@angular/common';

import { AuthService, GetPatientsService, RequestParametersService, Nested2longService } from '../_services';
import { AuthState, RequestParamArray } from '../_models';


@Component({
  selector: 'app-download-btn',
  templateUrl: './download-btn.component.html',
  styleUrls: ['./download-btn.component.scss']
})

export class DownloadBtnComponent implements OnInit {
  @Input() data: any;
  @Input() filetype: string;
  filename: string;
  auth_stub: string;
  today: string;
  qParams;

  sampleSortCols: string[] = ["creatorInitials", "sampleLabel", "sampleType", "isolationDate", "lab", "numAliquots"];

  constructor(
    private authSvc: AuthService,
    private requestSvc: RequestParametersService,
    private patientSvc: GetPatientsService,
    private datePipe: DatePipe,
    private longSvc: Nested2longService
  ) {
    this.today = this.datePipe.transform(new Date(), "yyyy-MM-dd");

    authSvc.authState$.subscribe((authState: AuthState) => {
      this.auth_stub = authState.authorized ? "_PRIVATE" : "";
    })

    requestSvc.patientParamsState$.subscribe((qParams: RequestParamArray) => {
      this.qParams = this.requestSvc.reducePatientParams(qParams);
      console.log(qParams)
      console.log(this.qParams)
    })
  }

  ngOnInit() {
    this.filename = `${this.today}_cvisb_${this.filetype}${this.auth_stub}.tsv`;
  }

  download() {
    this.downloadData();
  }

  parseData() {
    const columnDelimiter = '\t'; // technically, tab-separated, since some chemical cmpds have commas in names.
    const lineDelimiter = '\n';

    if (this.data && this.data.length > 0) {
      let colnames = Object.keys(this.data[0]);

      if (this.filetype === "samples") {
        colnames.sort((a, b) => this.sortingFunc(a, this.sampleSortCols) - this.sortingFunc(b, this.sampleSortCols))
      }

      // colnames = colnames.map(d => this.colnames_dict[d] || d) // convert to their longer name, if they have one. If not, return the existing value

      var dwnld_data = '';
      dwnld_data += colnames.join(columnDelimiter);
      dwnld_data += lineDelimiter;

      this.data.forEach(function(item) {
        let counter = 0;
        colnames.forEach(function(key) {
          if (counter > 0) dwnld_data += columnDelimiter;

          dwnld_data += item[key];
          counter++;
        });
        dwnld_data += lineDelimiter;
      });

      this.saveData(dwnld_data);
    }
  }

  saveData(dwnld_data) {
    var hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:text/tsv;charset=utf-8,' + encodeURI(dwnld_data);
    hiddenElement.target = '_blank';
    hiddenElement.download = this.filename;
    hiddenElement.click();
  }

  downloadData() {
    switch (this.filetype) {
      case ("patients"):
        this.patientSvc.getPatientRoster(this.qParams).subscribe(patients => {
          this.data = patients;
          this.parseData();
        });
        break;
      case ("samples"):
        this.data = this.longSvc.prep4download(this.data, ['location'], ['_score', '_version', '_id']);
        this.parseData();
        break;
      default:
        this.parseData();
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
