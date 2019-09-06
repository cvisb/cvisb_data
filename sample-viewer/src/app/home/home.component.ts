import { Component, OnInit } from '@angular/core';

import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

import { HttpParams } from '@angular/common/http';

import { environment } from '../../environments/environment';

import * as d3 from 'd3';

import { GetPatientsService, ApiService, GetHlaDataService } from '../_services'
// import { RequestParamArray, RequestParam} from '../_models'
//
import SAMPLES from '../../assets/data/test_samples.json';
import EXPTS from '../../assets/data/test_experiments.json';
import DATASETS from '../../assets/data/dataset_public.json';
import DOWNLOADS from '../../assets/data/test_datadownloads.json';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  alleleCount: any;
  patientCount: number;

  test = [{ name: "fdjaskfdls", seq: 'ejwifhajndjskfnkds' }]

  cards: Object[] = [
    { label: "Explore CViSB data", path: "dataset", description: "We will follow a strict release of open access data within two weeks of data generation.", warning: "CViSB-members only" },
    { label: "View CViSB patients", path: "patient", description: "View and search metadata for all current patients", warning: "CViSB-members only", tbd: false },
    { label: "View CViSB samples", path: "sample", description: "View and search location and metadata for all current samples", warning: "CViSB-members only" },
    { label: "About CViSB", path: "about", description: "Learn more about the Center for Viral Systems Biology" },
    { label: "Understand CViSB data", path: "documentation", description: "We know it's one thing to share data-- and another to make it FAIR. To improve the *findability* and *interoperability* of our data, we've created schemas for our dataset, patient, and experiment metadata built off of [schema.org](https://schema.org/)'s model.", tbd: false },
    { label: "Add or update CViSB data", path: "upload", description: "Add or change the metadata for datasets, patients, and samples", warning: "CViSB-members only", tbd: true },

  ];


  constructor(private titleSvc: Title, private route: ActivatedRoute, private patientSvc: GetPatientsService, public apiSvc: ApiService, private hlaSvc: GetHlaDataService) {
    // set page title
    let title = environment.production ? this.route.snapshot.data.title : 'DEV:' + this.route.snapshot.data.title;
    this.titleSvc.setTitle(title);

    this.hlaSvc.alleleCountState$.subscribe((cts: any[]) => {
      this.alleleCount = cts;
      console.log(cts)
    })


  }

  ngOnInit() {
    let patientParams = new HttpParams().set("q", "__all__");

    this.apiSvc.get("patient", patientParams, 0).subscribe(res => {
      console.log(res)
      this.patientCount = res['total'];
    });

    let transitionSync = d3.transition().duration(5000);

    let patientDiv = d3.selectAll("#patient").selectAll(".count-value");
    let dataDiv = d3.select("#dataset").selectAll(".count-value");
    let sampleDiv = d3.select("#sample").selectAll(".count-value");

    dataDiv.transition(transitionSync)
      // .duration(transitionTime * (312/5039))
      .tween("text", function(_) {
        let countMax = this['textContent'];
        var i = <any>d3.interpolate(0, countMax);
        return function(t) {
          d3.select(this).text(Math.round(i(t)));
        };
      });

    patientDiv.transition(transitionSync)
      // .duration(transitionTime)
      .tween("text", function(_) {
        let countMax = this['textContent'];
        var i = <any>d3.interpolate(0, countMax);
        return function(t) {
          d3.select(this).text(Math.round(i(t)));
        };
      });

    sampleDiv.transition(transitionSync)
      // .duration(transitionTime * (925/5039))
      .tween("text", function(_) {
        let countMax = this['textContent'];
        var i = <any>d3.interpolate(0, countMax);
        return function(t) {
          d3.select(this).text(Math.round(i(t)));
        };
      });
  }

}
