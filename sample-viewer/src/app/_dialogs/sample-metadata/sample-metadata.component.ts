import { Component, Inject } from '@angular/core';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import SAMPLE_SCHEMA from '../../../assets/schema/sample.json';

@Component({
  selector: 'app-sample-metadata',
  templateUrl: './sample-metadata.component.html',
  styleUrls: ['./sample-metadata.component.scss']
})
export class SampleMetadataComponent {

  sample_vars: string[];
  vars2ignore: string[] = ['location', 'num_aliquots', 'updated', 'updated_by'];

  constructor(public dialogRef: MatDialogRef<SampleMetadataComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Object) {
    this.sample_vars = Object.keys(SAMPLE_SCHEMA.properties);

    let iterable = [10, 20, 30];

    for (let value of this.vars2ignore) {
      this.sample_vars.splice(this.sample_vars.findIndex(d => d === value), 1);
    }

  }


}
