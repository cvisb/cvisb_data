import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-bulk-edit',
  templateUrl: './bulk-edit.component.html',
  styleUrls: ['./bulk-edit.component.scss']
})
export class BulkEditComponent implements OnInit {
  bulk: boolean = false;

  constructor() { }

  ngOnInit() {
  }

  switchBulk() {
    this.bulk = !this.bulk;
  }

}
