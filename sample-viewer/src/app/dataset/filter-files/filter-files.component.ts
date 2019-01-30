import { Component, OnInit, Input } from '@angular/core';

import { FileMetadataService } from '../../_services';
import { DatasetArray } from '../../_models';

@Component({
  selector: 'app-filter-files',
  templateUrl: './filter-files.component.html',
  styleUrls: ['./filter-files.component.scss']
})
export class FilterFilesComponent implements OnInit {
  @Input() datasets: any;
  anything_selected: boolean;
  datasetSummary: DatasetArray;

  constructor(private mdSvc: FileMetadataService) {
    mdSvc.fileClicked$.subscribe(status => {
      this.anything_selected = status;
    })
  }

  ngOnInit() {
      this.datasetSummary = new DatasetArray(this.datasets);
  }

}
