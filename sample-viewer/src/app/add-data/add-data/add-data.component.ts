import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';


@Component({
  selector: 'app-add-data',
  templateUrl: './add-data.component.html',
  styleUrls: ['./add-data.component.scss']
})
export class AddDataComponent implements OnInit {

  constructor(private route: ActivatedRoute,
    private titleSvc: Title) {

    route.data.subscribe(params => {
      // change the title of the page
      titleSvc.setTitle(params.title);
    });
  }

  ngOnInit() {
  }

}
