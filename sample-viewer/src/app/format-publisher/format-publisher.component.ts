import { Component, OnInit, Input } from '@angular/core';

import { Source } from '../_models';

@Component({
  selector: 'app-format-publisher',
  templateUrl: './format-publisher.component.html',
  styleUrls: ['./format-publisher.component.scss']
})
export class FormatPublisherComponent implements OnInit {
  @Input() publisher: Source;
  @Input() verbosity: string = "simple";
  @Input() source_year: Date = new Date();
  @Input() source_url: string;

  constructor() { }

  ngOnInit() {
  }

}
