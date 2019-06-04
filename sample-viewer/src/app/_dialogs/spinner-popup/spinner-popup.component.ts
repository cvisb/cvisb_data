import { Component, OnInit, Inject } from '@angular/core';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-spinner-popup',
  templateUrl: './spinner-popup.component.html',
  styleUrls: ['./spinner-popup.component.scss']
})

export class SpinnerPopupComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<SpinnerPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string) {
    }

  ngOnInit() {
  }

}
