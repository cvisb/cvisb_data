import { Component, OnInit, Input } from '@angular/core';

import { Citation } from '../_models';

@Component({
  selector: 'app-format-citation',
  templateUrl: './format-citation.component.html',
  styleUrls: ['./format-citation.component.scss']
})

export class FormatCitationComponent implements OnInit {
  @Input() citations: Citation[];
  @Input() verbosity: string; // one of "basic", "links", or "verbose"

  constructor() { }

  ngOnInit() {
  }

}
