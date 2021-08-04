import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';

import { AuthService, getDatasetsService } from '../_services/';


import { Dataset, DatasetSchema } from '../_models';

@Component({
  selector: 'app-dataset-page',
  templateUrl: './dataset-page.component.html',
  styleUrls: ['./dataset-page.component.scss']
})

export class DatasetPageComponent implements OnInit {
  dataset: Dataset;
  datasetSchema: DatasetSchema;

  constructor(private route: ActivatedRoute,
    private meta: Meta,
    private titleSvc: Title,
    private authSvc: AuthService,
    private datasetSvc: getDatasetsService
  ) {
  }

  ngOnInit() {
    // fetch dataset data from resolver.
    this.dataset = this.route.snapshot.data['datasetData'];

    this.datasetSchema = this.datasetSvc.removeNonSchema(this.dataset);

    // Set page name
    if (this.route.snapshot.data['datasetData']) {
      this.titleSvc.setTitle(`${this.route.snapshot.data['datasetData']['name']}`)
    }

    // Show terms, if they haven't been displayed before:
    this.authSvc.popupTerms();
  }


  // selectDataset($event: Event, selected: any) {
  //   $event.preventDefault();
  //   $event.stopPropagation();  // <- that will stop propagation on lower layers
  //
  //   this.mdSvc.sendMetadata(selected, 'Dataset');
  //   this.mdSvc.clickFile(true);
  // }

}
