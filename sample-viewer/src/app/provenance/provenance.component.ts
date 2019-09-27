import { Component, OnInit, Input } from '@angular/core';

import { Citation } from '../_models/';

@Component({
  selector: 'app-provenance',
  templateUrl: './provenance.component.html',
  styleUrls: ['./provenance.component.scss']
})

export class ProvenanceComponent implements OnInit {
  @Input() dateModified: string;
  @Input() embargoLabel: string;
  @Input() embargoed: boolean = false;
  @Input() source: string = "Center for Viral Systems Biology";
  @Input() changes: string;
  @Input() public_data: boolean = false;
  @Input() cvisb_data: boolean;
  @Input() citation: Citation[];

  constructor() { }

  ngOnInit() {
    // Search within any part of the string for CViSB
    this.cvisb_data = this.source.indexOf("Center for Viral Systems Biology") >= 0;
  }

}
