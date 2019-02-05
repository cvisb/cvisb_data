import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';

import { getDatasetsService, FileMetadataService } from '../_services';


@Component({
  selector: 'app-dataset-page',
  templateUrl: './dataset-page.component.html',
  styleUrls: ['./dataset-page.component.scss']
})

export class DatasetPageComponent implements OnInit {
  private dsid: string; // file ID
  private datasets: Object[];
  dataset: Object;
  schema_dataset: Object;

  constructor(private route: ActivatedRoute,
    private meta: Meta,
    private titleSvc: Title,
    private fileSvc: getDatasetsService,
    private mdSvc: FileMetadataService,
  ) {

    // Pull out the file ID
    route.params.subscribe(params => {
      this.dsid = params['dsid'];
    });

    // Hit API to get data
    // this.datasets = fileSvc.getDatasets();
    // TODO: check if more than one dataset.
    // this.dataset = this.datasets.filter((d: any) => d.identifier === this.dsid)[0];
    fileSvc.getDataset(this.dsid).subscribe((dataset) => {
      console.log('dataset from API:')
      console.log(dataset)
      this.dataset = dataset;

      if (dataset) {
        // Set page name
        this.titleSvc.setTitle(`${this.dataset['name']} ${this.route.snapshot.data.title}`)
      }
    })

    // TEMP: shim to remove non-schema.org offensive fields
    this.schema_dataset = fileSvc.getSchema(this.dsid);
    console.log(this.schema_dataset);

  }

  ngOnInit() {
  }


  selectDataset($event: Event, selected: any) {
    $event.preventDefault();
    $event.stopPropagation();  // <- that will stop propagation on lower layers

    this.mdSvc.sendMetadata(selected, 'Dataset');
    this.mdSvc.clickFile(true);
  }

}
