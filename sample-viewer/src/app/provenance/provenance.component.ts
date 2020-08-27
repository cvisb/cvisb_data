import { Component, OnInit, Input } from '@angular/core';

import { Citation } from '../_models/';

import { CorrectionsComponent } from '../_dialogs/corrections/corrections.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-provenance',
  templateUrl: './provenance.component.html',
  styleUrls: ['./provenance.component.scss']
})

export class ProvenanceComponent implements OnInit {
  @Input() dateModified: string;
  @Input() embargoLabel: string;
  @Input() embargoed: boolean = false;
  @Input() dataStatus: string;
  @Input() source: any;
  @Input() changes: string;
  @Input() public_data: boolean = false;
  @Input() cvisb_data: boolean;
  @Input() citation: Citation[];

  constructor(public dialog: MatDialog) { }

  ngOnInit() {
    // Search within any part of the string for CViSB
    if (this.source) {
      if(!Array.isArray(this.source)){
        if(typeof(this.source) == "string") {
          this.source = [{name: this.source}];
        } else if(typeof(this.source) == "object") {
          this.source = [this.source];
        }
      }

      this.cvisb_data = this.source.some((d: any) => d.name.includes("Center for Viral Systems Biology"));
    } else {
      this.cvisb_data = false;
    }
  }

  showCorrections($event: Event, changes): void {
    $event.preventDefault();
    $event.stopPropagation();  // <- that will stop propagation on lower layers

    const dialogRef = this.dialog.open(CorrectionsComponent, {
      width: '450px',
      data: { correction: changes, label: this.embargoLabel }
    });
  }

}
