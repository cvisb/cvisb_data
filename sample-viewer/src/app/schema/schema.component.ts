import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { DOCUMENT } from '@angular/common';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-schema',
  templateUrl: './schema.component.html',
  styleUrls: ['./schema.component.scss']
})
export class SchemaComponent implements OnInit {
  schemas: string[];
  description: string = "We know it's one thing to share data-- and another to make it FAIR. To improve the *findability* and *interoperability* of our data, we've created schemas for our dataset, patient, and experiment metadata built off of [schema.org](https://schema.org/)'s model.";

  constructor(
    @Inject(DOCUMENT) private document: any,
    public http: HttpClient,
    private titleSvc: Title,
    private route: ActivatedRoute
  ) {
    this.titleSvc.setTitle(this.route.snapshot.data.title);
  }

  ngOnInit() {

    this.http.get<any>(environment.api_url + "/jsonschema", {
      observe: 'response',
      headers: new HttpHeaders()
        .set('Accept', 'application/json')
    }).subscribe(data => {
      this.schemas = data.body.available_schema;
    },
      err => {
        console.log('Error in getting schema')
        console.log(err)
      })

  }

  routeSchema(schema) {
    this.document.location.href = `${environment.host_url}/jsonschema/${schema}.json`
  }

}
