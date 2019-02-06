import { Component, OnInit, Input } from '@angular/core';
import { DatePipe } from '@angular/common';

import { AuthService } from '../_services';
import { AuthState } from '../_models';


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

  constructor(private authSvc: AuthService,
    private datePipe: DatePipe) {
    this.today = this.datePipe.transform(new Date(), "yyyy-MM-dd");

    authSvc.authState$.subscribe((authState: AuthState) => {
      this.auth_stub = authState.authorized ? "_PRIVATE" : "";
    })
  }

  ngOnInit() {
    this.filename = `${this.today}_cvisb_${this.filetype}${this.auth_stub}.tsv`;
  }

  download(data) {
    const columnDelimiter = '\t'; // technically, tab-separated, since some chemical cmpds have commas in names.
    const lineDelimiter = '\n';

    let colnames = Object.keys(this.data[0]);
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

    this.save_data(dwnld_data)
  }

  save_data(dwnld_data) {
    var hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:text/tsv;charset=utf-8,' + encodeURI(dwnld_data);
    hiddenElement.target = '_blank';
    hiddenElement.download = this.filename;
    hiddenElement.click();
  }


}
