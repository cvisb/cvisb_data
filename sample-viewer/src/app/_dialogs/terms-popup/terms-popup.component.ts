import { Component, OnInit, Inject } from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-terms-popup',
  templateUrl: './terms-popup.component.html',
  styleUrls: ['./terms-popup.component.scss']
})

export class TermsPopupComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<TermsPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string) {
  }

  ngOnInit() {
  }

}
