import { Component, OnInit } from '@angular/core';

import { getDatasetsService } from '../_services';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-download-expts',
  templateUrl: './download-expts.component.html',
  styleUrls: ['./download-expts.component.scss']
})
export class DownloadExptsComponent implements OnInit {
  datasets$: Observable<Object[]>;

  constructor(private datasetSvc: getDatasetsService) {
    this.datasets$ = this.datasetSvc.getDatasets();
  }

  ngOnInit() {
  }

}
