import { Component, OnInit, Input } from '@angular/core';

import { Source } from '../_models';

@Component({
  selector: 'app-format-publisher',
  templateUrl: './format-publisher.component.html',
  styleUrls: ['./format-publisher.component.scss']
})
export class FormatPublisherComponent implements OnInit {
  @Input() publisher: Source;

  constructor() { }

  ngOnInit() {
    console.log(this.publisher)
  }

}
