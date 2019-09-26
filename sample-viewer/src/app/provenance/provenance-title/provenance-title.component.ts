import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-provenance-title',
  templateUrl: './provenance-title.component.html',
  styleUrls: ['./provenance-title.component.scss']
})
export class ProvenanceTitleComponent implements OnInit {
  @Input() title: string;
  @Input() embargoed: boolean = false;
  @Input() private: boolean = false;
  @Input() icon: string;

  constructor() { }

  ngOnInit() {
  }

}
