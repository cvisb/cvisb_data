import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-md-object',
  templateUrl: './md-object.component.html',
  styleUrls: ['./md-object.component.scss']
})
export class MdObjectComponent {
  @Input() metadata: Object;
  keys: string[];

  constructor() {
  }

  ngOnInit() {
    if (this.metadata) {
      this.keys = Object.keys(this.metadata);
    }
  }


}
