import { Component, OnInit } from '@angular/core';

import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

import { environment } from '../../environments/environment';

import { GetPatientsService, ApiService } from '../_services'
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

  cards: Object[] = [
    { label: "Explore CViSB data", path: "dataset", description: "We will follow a strict release of open access data within two weeks of data generation. Please check back here for more updates as soon as the data starts coming off the machines." },
    { label: "View CViSB schema", path: "schema", description: "We know it's one thing to share data-- and another to make it FAIR. To improve the *findability* and *interoperability* of our data, we've created schemas for our dataset, patient, and experiment metadata built off of [schema.org](https://schema.org/)'s model.", tbd: false },
    { label: "View CViSB patients", path: "patient", description: "View and search metadata for all current patients", warning: "CViSB-members only", tbd: true },
    { label: "View CViSB samples", path: "sample", description: "View and search location and metadata for all current samples", warning: "CViSB-members only" },
    { label: "Add or update CViSB samples", path: "sample/upload", description: "Add or change the metadata or location information for a sample", warning: "CViSB-members only", tbd: true },

  ];


  constructor(private titleSvc: Title, private route: ActivatedRoute, private patientSvc: GetPatientsService, public apiSvc: ApiService) {
    // set page title
    let title = environment.production ? this.route.snapshot.data.title : 'DEV:' + this.route.snapshot.data.title;
    this.titleSvc.setTitle(title);


    // patientSvc.patientParamsState$.subscribe((params: RequestParamArray) => {
    //   console.log('getting most recent patient params!')
    //   console.log(params)
    //   this.params = params;
    // })
  }

  ngOnInit() {
    // this.params = new RequestParamArray([new RequestParam('country.identifier', '2')]);
    // // this.params.push(new RequestParam('country.identifier', '2'));
    // console.log(this.params)
    // console.log(this.params.collapse())

    console.log(DATASETS)
    this.apiSvc.put('sample', SAMPLES);
    this.apiSvc.put('experiment', EXPTS);
    this.apiSvc.put('dataset', DATASETS);
    this.apiSvc.put('datadownload', DOWNLOADS);
  }

}
