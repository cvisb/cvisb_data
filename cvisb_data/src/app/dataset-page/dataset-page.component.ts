import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';

import { GetFilesService, FileMetadataService } from '../_services';
import * as _ from 'lodash';

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
    private fileSvc: GetFilesService,
    private mdSvc: FileMetadataService,
  ) {

    // Pull out the file ID
    route.params.subscribe(params => {
      this.dsid = params['dsid'];
    });

    // Hit API to get data
    this.datasets = fileSvc.getFiles();
    // TODO: check if more than one dataset.
    this.dataset = this.datasets.filter((d: any) => d.identifier === this.dsid)[0];

    // TEMP: shim to remove non-schema.org offensive fields
    this.removeNonSchema(this.dataset);

    // Set page name
    this.titleSvc.setTitle(`${this.dataset['name']} ${this.route.snapshot.data.title}`)
    // add structured metadata into meta tag
    // this.meta.addTag({ name: 'jfaksdl', content: 'fdsklfdsfjkdsl' });
  }

  ngOnInit() {
  }

  removeNonSchema(ds) {
    this.schema_dataset = _.cloneDeep(ds); // create copy

    // remove stuff from the dataset object
    let schemaorg = ["@context", "@type", "identifier", "name", "description", "url", "@id", "keywords", "measurementTechnique", "variableMeasured", "datePublished", "dateModified", "temporalCoverage", "spatialCoverage", "includedInDataCatalog", "author", "publisher", "version", "schemaVersion", "distribution"];
    // removes "sourceCode" -- different name in schema.org
    for (let key of Object.keys(this.schema_dataset)) {
      if (!schemaorg.includes(key)) {
        // console.log('deleting ' + key)
        delete this.schema_dataset[key];
      }
    }

    // remove stuff from individual files
    let schemaorg_distrib = ["@type", "name", "description", "keywords", "version", "additionalType", "encodingFormat", "measurementTechnique", "datePublished", "dateModified", "@id", "contentUrl"];
    for (let file of this.schema_dataset['distribution']) {
      let keys = Object.keys(file);

      for (let key of keys) {
        if (!schemaorg_distrib.includes(key)) {
          delete file[key];
        }
      }
    }
  }

  // ngAfterViewInit() {
  //   // this.meta.addTag({ name: 'jfaksdl', content: 'fdsklfdsfjkdsl' });
  // }


  selectDataset($event: Event, selected: any) {
    $event.preventDefault();
    $event.stopPropagation();  // <- that will stop propagation on lower layers

    this.mdSvc.sendMetadata(selected, 'Dataset');
    this.mdSvc.clickFile(true);
  }

}
