import { Component, Inject } from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-corrections',
  templateUrl: './corrections.component.html',
  styleUrls: ['./corrections.component.scss']
})
export class CorrectionsComponent {

  constructor(public dialogRef: MatDialogRef<CorrectionsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Object) { }

  ngOnInit() {
  }

}
