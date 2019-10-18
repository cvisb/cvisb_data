import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

import { HttpParams } from '@angular/common/http';

import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';

import { latLng, tileLayer } from 'leaflet';

import * as d3 from 'd3';

import { ApiService, GetDatacatalogService, GetExperimentsService } from '../_services';
import { ReleaseNote } from '../_models';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  patientCount: number;
  sampleCount: number;
  experimentCount: Object[] = [];
  releaseVersion: string;
  cvisbCatalog: Object;
  releaseNotes: ReleaseNote[];

  // options = {
  //   layers: [
  //     tileLayer(
  //       'https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}{r}.png',
  //       // 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
  //       // 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
  //       { minZoom: 5, maxZoom: 18, attribution: '...' })
  //   ],
  //   zoom: 5,
  //   center: latLng(10.9281311, -0.518234)
  // };

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private titleSvc: Title,
    private route: ActivatedRoute,
    private dataCatalogSvc: GetDatacatalogService,
    private exptSvc: GetExperimentsService,
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
    if (isPlatformBrowser(this.platformId)) {
      // let patientParams = new HttpParams().set("q", "__all__");
      // let transitionSync = d3.transition().duration(5000);
      //
      // this.apiSvc.get("patient", patientParams, 0).subscribe(res => {
      //   this.patientCount = res['total'];
      //
      //   let patientDiv = d3.selectAll("#patient").selectAll(".count-value");
      //
      //   patientDiv.transition(transitionSync)
      //     // .duration(transitionTime)
      //     .tween("text", function(_) {
      //       let countMax = this['textContent'];
      //       var i = <any>d3.interpolate(0, countMax);
      //       return function(t) {
      //         d3.select(this).text(Math.round(i(t)));
      //       };
      //     });
      // });
      //
      // this.apiSvc.get("sample", patientParams, 0).subscribe(res => {
      //   this.sampleCount = res['total'];
      //
      //   let sampleDiv = d3.select("#sample").selectAll(".count-value");
      //
      //   sampleDiv.transition(transitionSync)
      //     // .duration(transitionTime * (925/5039))
      //     .tween("text", function(_) {
      //       let countMax = this['textContent'];
      //       var i = <any>d3.interpolate(0, countMax);
      //       return function(t) {
      //         d3.select(this).text(Math.round(i(t)));
      //       };
      //     });
      // });
      //
      // this.exptSvc.getExptCounts().subscribe(res => {
      //   this.experimentCount = res;
      //
      //
      //   let dataDiv = d3.selectAll("#dataset").selectAll(".count-value");
      //
      //   dataDiv.transition(transitionSync)
      //     // .duration(transitionTime * (312/5039))
      //     .tween("text", function(_) {
      //       let countMax = this['textContent'];
      //       var i = <any>d3.interpolate(0, countMax);
      //       return function(t) {
      //         d3.select(this).text(Math.round(i(t)));
      //       };
      //     });
      // })
this.getSummaryCounts();
    }
  }

  getSummaryCounts() {
    let patientParams = new HttpParams().set("q", "__all__");
    let transitionSync = d3.transition().duration(5000);


    forkJoin(this.apiSvc.get("patient", patientParams, 0), this.apiSvc.get("sample", patientParams, 0), this.exptSvc.getExptCounts())
      .pipe(
        map(([patients, samples, expts]) => {
          console.log(patients)
          console.log(samples)
          console.log(expts)
          // patients
          this.patientCount = patients['total'];

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

          // Samples
          this.sampleCount = samples['total'];

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
          // experiments
          this.experimentCount = expts;


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
        })
      );
  }

}
