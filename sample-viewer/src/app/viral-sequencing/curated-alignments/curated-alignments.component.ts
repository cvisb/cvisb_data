import { Component, OnInit, Input } from '@angular/core';

import { getDatasetsService } from '../../_services/';
import { DataDownload } from '../../_models';

@Component({
  selector: 'app-curated-alignments',
  templateUrl: './curated-alignments.component.html',
  styleUrls: ['./curated-alignments.component.scss']
})

export class CuratedAlignmentsComponent implements OnInit {
  @Input() includedInDataset: string;
  curated: DataDownload[];

  constructor(private datasetSvc: getDatasetsService) {
  }

  ngOnInit() {
    this.datasetSvc.getFiles(`additionalType:"curated data" AND includedInDataset:${this.includedInDataset}`).subscribe(files => {
      this.curated = files;
    })
  }

}
