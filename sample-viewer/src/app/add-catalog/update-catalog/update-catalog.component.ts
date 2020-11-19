import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { pipe, Subscription, Observable } from "rxjs";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";
import { GetDatacatalogService, AuthService, ApiService } from '../../_services/';
import { CvisbUser, DataCatalog, ReleaseNote } from '../../_models';
import { nest } from "d3";

@Component({
  selector: 'app-update-catalog',
  templateUrl: './update-catalog.component.html',
  styleUrls: ['./update-catalog.component.scss']
})

export class UpdateCatalogComponent implements OnDestroy {
  user: CvisbUser;
  userSubscription: Subscription;
  versionForm: FormGroup;
  summaryForm: FormGroup;
  releaseForm: FormGroup;
  newNote: ReleaseNote;
  categories: string[] = ["Data", "Patient", "Dataset", "Sample", "Download", "Performance", "General", "Bugs"];
  debounceTime: number = 400;
  catalog: DataCatalog;
  catalogSubscription: Subscription;
  datasets: any;
  datasetSubscription: Subscription;
  currentVersion: number[];
  uploadResponse: string = "not submitted";

  constructor(
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private authSvc: AuthService,
    private apiSvc: ApiService,
    private catalogSvc: GetDatacatalogService
  ) {
    this.userSubscription = this.authSvc.userState$.subscribe((user: CvisbUser) => {
      this.user = user;
    })

    this.catalogSubscription = this.catalogSvc.dataCatalog$.subscribe(catalog => {
      console.log(catalog)
      this.catalog = catalog;
      if (this.catalog && this.catalog.releaseVersion) {
        console.log("YES")
        console.log(this.catalog)
        this.currentVersion = this.catalog['releaseVersion'].split(".").map(d => +d);
        this.versionForm.setValue({ major: this.currentVersion[0], minor: this.currentVersion[1], patch: this.currentVersion[2] });
      }
    });

    this.datasetSubscription = this.catalogSvc.getDatasets().subscribe(datasets => {
      this.datasets = datasets;
      console.log(this.datasets)
    });

    this.versionForm = this.fb.group({
      major: new FormControl(0, Validators.required),
      minor: 0,
      patch: 0
    })

    this.summaryForm = this.fb.group({
      abstract: new FormControl(),
      datePublished: new FormControl(new Date())
    })

    this.releaseForm = this.fb.group({
      noteGroups: this.fb.array([this.createNote()])
    })

    // subscribe to changes in form
    this.versionForm.valueChanges
      .pipe(
        debounceTime(this.debounceTime),
        distinctUntilChanged()
      )
      .subscribe(_ => {
        this.newNote = this.generateJson();
      });

    this.summaryForm.valueChanges
      .pipe(
        debounceTime(this.debounceTime),
        distinctUntilChanged()
      )
      .subscribe(_ => {
        this.newNote = this.generateJson();
      });

    this.releaseForm.valueChanges
      .pipe(
        debounceTime(this.debounceTime),
        distinctUntilChanged()
      )
      .subscribe(_ => {
        this.newNote = this.generateJson();
      });

  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
    this.catalogSubscription.unsubscribe();
    this.datasetSubscription.unsubscribe();
  }

  // Get method to grab the formArray within formGroup
  // https://github.com/angular/angular-cli/issues/6099#issuecomment-297982698
  get noteArray() {
    return this.releaseForm.get('noteGroups') as FormArray;
  }

  createNote(): FormGroup {
    return this.fb.group({
      category: null,
      note: null
    });
  }

  addNote() {
    this.noteArray.push(this.createNote());
  }

  deleteNote($event, idx) {
    // Remove the group from the array
    this.noteArray.removeAt(idx);
  }

  uploadCatalog() {
    // update user updatedBy
    this.catalog["updatedBy"] = this.user.name ? this.user.name : "unknown";

    // update releaseVersion
    this.catalog["releaseVersion"] = this.getVersion();

    // update dataset list
    this.catalog["dataset"] = this.datasets;

    // append new release note
    this.newNote = this.generateJson();
    this.catalog["releaseNotes"].push(this.newNote);
    if (this.catalog["_score"]) {
      delete this.catalog["_score"];
    }
    if (this.catalog["_version"]) {
      delete this.catalog["_version"];
    }
    console.log(this.catalog);

    this.uploadResponse = "Sending data to the database.  Be patient! This can take a few minutes";
    this.apiSvc.putPiecewise("datacatalog", [this.catalog]).subscribe(
      responses => {
        console.log(responses)
        // this.uploadReponse = responses;
        // this.uploadResponse = result.uploadResponse;
        // this.errorMsg = result.errorMsg;
        // this.errorObj = result.errorObj;
      })

  }

  getVersion() {
    let versionObj = this.versionForm.value;
    return (`${versionObj.major}.${versionObj.minor}.${versionObj.patch}`)
  }

  generateJson() {
    let notes = this.releaseForm.get("noteGroups").value;
    notes = nest()
      .key(note => note["category"])
      .rollup((values: any) => values.map(d => d.note))
      .entries(notes)
      .map(d => {
        return ({ category: d.key, note: d.value })
      })

    return ({
      datePublished: this.datePipe.transform(this.summaryForm.get("datePublished").value, "yyyy-MM-dd"),
      abstract: this.summaryForm.get("abstract").value,
      version: this.getVersion(),
      description: notes
    })
  }

}
