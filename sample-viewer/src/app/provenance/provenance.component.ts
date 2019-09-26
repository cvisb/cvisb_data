import { Component, OnInit, Input } from '@angular/core';

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

  constructor() { }

  ngOnInit() {
  }

}
