import { Component, Input } from '@angular/core';

import { FileMetadataService } from '../../_services';

import DATASET_SCHEMA from '../../../assets/schema/dataset.json';
import FILE_SCHEMA from '../../../assets/schema/datadownload.json';
import EXPT_SCHEMA from '../../../assets/schema/experiment.json';

@Component({
  selector: 'app-file-metadata',
  templateUrl: './file-metadata.component.html',
  styleUrls: ['./file-metadata.component.scss']
})
export class FileMetadataComponent {
  mdtype: string;
  metadata: Object;

  mdkeys: string[];
  expt_md: string[];

  constructor(mdSvc: FileMetadataService) {
    mdSvc.currentFileMD$.subscribe(md => {
      this.metadata = md['metadata'];
      this.mdtype = md['type'];

      if (md && md['type'] === 'DataDownload') {
        // this.mdkeys = Object.keys(this.metadata);
        this.mdkeys = this.getMDKeys(FILE_SCHEMA);
        this.expt_md = this.getMDKeys(EXPT_SCHEMA);

        // don't show whether the entry has been clicked on
        // this.mdkeys.splice(this.mdkeys.indexOf('selected'), 1);
      } else if(md && md['type'] === 'Dataset'){
        this.mdkeys = this.getMDKeys(DATASET_SCHEMA);
      }
    })

  }

  getMDKeys(schema: any) {
    let keys = [];

    keys = schema['@graph'].filter((d: any) => d['@type'] === "rdf:Property").map((d: any) => d['rdfs:label'])
    return (keys)
  }

  // Necessary to prevent the "click anywhere" behavior to turn off file selection from taking over
  accordionClicked($event) {
    $event.preventDefault();
    $event.stopPropagation();
  }

  isObject(value) {
    return typeof value === 'object';
  }


}
