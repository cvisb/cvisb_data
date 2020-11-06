import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dataset-page-generic',
  templateUrl: './dataset-page-generic.component.html',
  styleUrls: ['./dataset-page-generic.component.scss']
})
export class DatasetPageGenericComponent implements OnInit {

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    console.log(this.route.snapshot)
  }

}
