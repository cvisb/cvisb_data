import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { pipe, Subscription, Observable } from "rxjs";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";
import { GetDatacatalogService, AuthService } from '../../_services/';
import { CvisbUser, DataCatalog, ReleaseNote } from '../../_models';

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

  constructor(
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private authSvc: AuthService,
    private catalogSvc: GetDatacatalogService
  ) {
    this.userSubscription = this.authSvc.userState$.subscribe((user: CvisbUser) => {
      this.user = user;
    })

    this.catalogSubscription = this.catalogSvc.dataCatalog$.subscribe(catalog => {
      this.catalog = catalog;
      this.currentVersion = this.catalog['releaseVersion'].split(".").map(d => +d);
      this.versionForm.setValue({ major: this.currentVersion[0], minor: this.currentVersion[1], patch: this.currentVersion[2] });
    });

    this.datasetSubscription = this.catalogSvc.getDatasets().subscribe(datasets => {
      this.datasets = datasets;
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

    console.log(this.catalog)
    console.log(this.datasets)


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

  }

  getVersion() {
    let versionObj = this.versionForm.value;
    return (`${versionObj.major}.${versionObj.minor}.${versionObj.patch}`)
  }

  generateJson() {
    return ({
      datePublished: this.datePipe.transform(this.summaryForm.get("datePublished").value, "yyyy-MM-dd"),
      abstract: this.summaryForm.get("abstract").value,
      version: this.getVersion(),
      description: this.releaseForm.get("noteGroups").value
    })
  }

}
