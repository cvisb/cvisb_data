import { Component, Inject } from '@angular/core';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-sample-metadata',
  templateUrl: './sample-metadata.component.html',
  styleUrls: ['./sample-metadata.component.scss']
})
export class SampleMetadataComponent {

  sample_vars: string[];
  vars2ignore: string[] = ['_id', '_score'];

  constructor(public dialogRef: MatDialogRef<SampleMetadataComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Object) {
    this.sample_vars = Object.keys(this.data);

    this.sample_vars = this.sample_vars.filter(d => !this.vars2ignore.includes(d));
  }
}
