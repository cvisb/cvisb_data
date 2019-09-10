import { Component, OnInit } from '@angular/core';

import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

import { HttpParams } from '@angular/common/http';

import { environment } from '../../environments/environment';

import * as d3 from 'd3';

import { ApiService, GetDatacatalogService } from '../_services';
import { ReleaseNote } from '../_models';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  alleleCount: any;
  patientCount: number;
  sampleCount: number;
  experimentCount: Object[] = [];
  releaseVersion: string;
  cvisbCatalog: Object;
  releaseNotes: ReleaseNote[];

  // connection between measurementTechnique and /dataset/{dsid}
  exptDict = { 'HLA sequencing': 'hla', 'viral sequencing': 'viralseq' };


  constructor(private titleSvc: Title,
    private route: ActivatedRoute,
    private dataCatalogSvc: GetDatacatalogService,
    public apiSvc: ApiService) {
    this.cvisbCatalog = this.dataCatalogSvc.cvisbCatalog;
    if (this.cvisbCatalog) {
      this.releaseVersion = this.cvisbCatalog['releaseVersion'];
    }
    this.releaseNotes = this.dataCatalogSvc.releaseNotes;

    // set page title
    let title = environment.production ? this.route.snapshot.data.title : 'DEV:' + this.route.snapshot.data.title;
    this.titleSvc.setTitle(title);
  }

  ngOnInit() {
    let patientParams = new HttpParams().set("q", "__all__");
    let exptParams = new HttpParams()
      .set("q", "__all__")
      .set("facets", "measurementTechnique.keyword");

    let transitionSync = d3.transition().duration(5000);

    this.apiSvc.get("patient", patientParams, 0).subscribe(res => {
      this.patientCount = res['total'];

      let patientDiv = d3.selectAll("#patient").selectAll(".count-value");

      patientDiv.transition(transitionSync)
        // .duration(transitionTime)
        .tween("text", function(_) {
          let countMax = this['textContent'];
          var i = <any>d3.interpolate(0, countMax);
          return function(t) {
            d3.select(this).text(Math.round(i(t)));
          };
        });
    });

    this.apiSvc.get("sample", patientParams, 0).subscribe(res => {
      this.sampleCount = res['total'];

      let sampleDiv = d3.select("#sample").selectAll(".count-value");

      sampleDiv.transition(transitionSync)
        // .duration(transitionTime * (925/5039))
        .tween("text", function(_) {
          let countMax = this['textContent'];
          var i = <any>d3.interpolate(0, countMax);
          return function(t) {
            d3.select(this).text(Math.round(i(t)));
          };
        });
    });

    this.apiSvc.get("experiment", exptParams, 0).subscribe(res => {
      this.experimentCount = res["facets"]["measurementTechnique.keyword"].terms;
      this.experimentCount.forEach(d => {
        d['link'] = this.exptDict[d['term']];
      })

      let dataDiv = d3.selectAll("#dataset").selectAll(".count-value");

      dataDiv.transition(transitionSync)
        // .duration(transitionTime * (312/5039))
        .tween("text", function(_) {
          let countMax = this['textContent'];
          var i = <any>d3.interpolate(0, countMax);
          return function(t) {
            d3.select(this).text(Math.round(i(t)));
          };
        });
    });

  }

}
