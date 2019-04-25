import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { DatePipe } from '@angular/common';

import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

import { CvisbUser } from '../_models';
import { AuthService } from './auth.service';
import { CheckIdsService } from './check-ids.service';
import { MergeService } from './merge.service';

import { nest, sum } from 'd3';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})

export class SampleUploadService {

  
  user: CvisbUser;
  data: Object[]; // copy of sample data to be uploaded.
  steps = [
    { id: "upload", complete: false, label: "select file", data: null },
    { id: "process", complete: false, label: "process data", data: null },
    { id: "changes", complete: false, label: "review changes", data: null },
    { id: "additions", complete: false, label: "preview additions", data: null },
    // { id: "validate", complete: false, label: "validate data", explanation: "Make sure patient and sample IDs are unique" },
    { id: "submit", complete: false, label: "save to database", data: null },
  ]

  stepsForm =
    [{ 'upload': { complete: false, label: "select file", data: null } },
    { "process": { complete: false, label: "process data", data: null } }];


  frontend_validation = [
    { id: "check_req", complete: false, label: "Checking for required fields", numErrors: null, data: null },
    { id: "delete_extra", complete: false, label: "Deleting extra rows", numErrors: null, verified: null },
    { id: "check_ids", complete: false, label: "Checking patient ID structure", numErrors: null, verified: null },
    { id: "combine_dupes", complete: false, label: "Combining duplicate samples", numErrors: null, verified: null },
    { id: "parse_dates", complete: false, label: "Parsing dates", numErrors: null, verified: null },
    { id: "create_sampleID", complete: false, label: "Creating unique sample ID", numErrors: null },
    // { id: "check_locations", complete: false, label: "Checking location changes", numErrors: null },
  ]

  requiredFields = ["sampleLabel", "privatePatientID", "sampleType", "isolationDate", "location", "numAliquots"];



  public uploadSamplesSubject: BehaviorSubject<Object[]> = new BehaviorSubject<Object[]>([]);
  public uploadSamplesState$ = this.uploadSamplesSubject.asObservable();

  public uploadStepSubject: BehaviorSubject<number> = new BehaviorSubject<number>(-1);
  public uploadStepState$ = this.uploadStepSubject.asObservable();

  public progressSubject: BehaviorSubject<Object[]> = new BehaviorSubject<Object[]>(this.steps);
  public progressState$ = this.progressSubject.asObservable();

  public progressSubject2: BehaviorSubject<Object[]> = new BehaviorSubject<Object[]>(this.stepsForm);
  public progressState2$ = this.progressSubject2.asObservable();

  public FEvalidationSubject: BehaviorSubject<Object[]> = new BehaviorSubject<Object[]>(this.frontend_validation);
  public FEvalidationState$ = this.FEvalidationSubject.asObservable();


  constructor(
    private datePipe: DatePipe,
    private authSvc: AuthService,
    private idSvc: CheckIdsService,
    private mergeSvc: MergeService
  ) {
    authSvc.userState$.subscribe((user: CvisbUser) => {
      this.user = user;
    })

    // Check if the FE validation is completed with no errors or verified.
    // If so, update the progress variable. If not, tant pis.
    this.FEvalidationState$.subscribe(state => {
      if (state.map((d: any) => d.numErrors === 0 || d.verified).every(d => d === true)) {
        this.updateProgress("process", true);
      } else {
        this.updateProgress("process", false);
      }
    })
  }

  getData() {
    return (this.data);
  }

  // Return only the fields needed to be uploaded, after front-end validation
  // No going back from this point!
  getCleanedData(vars2delete = ['creatorInitials', 'id_check', 'id_okay', 'missing', 'originalID']) {
    let data_copy = _.cloneDeep(this.data);

    data_copy.forEach((d: any) => {
      vars2delete.forEach(col_name => {
        delete d[col_name];
      })
    })

    console.log("Front-end validated data")
    console.log(data_copy);

    this.uploadSamplesSubject.next(data_copy);
    // return (this.data);
  }



  updateProgress(id: string, status: boolean) {
    let idx = this.steps.findIndex(d => d.id === id);



    if (idx > -1) {
      this.uploadStepSubject.next(idx);
      this.steps[idx].complete = status;
      this.stepsForm[idx][id]['complete'] = status;
      this.progressSubject.next(this.steps);
      this.progressSubject2.next(this.stepsForm);
    }
  }

  updateValidation(id: string, status?: boolean, errors?: number, data?: any, verified?: boolean) {
    let idx = this.frontend_validation.findIndex(d => d.id === id);

    if (idx > -1) {
      if (status !== null) this.frontend_validation[idx].complete = status;
      if (errors !== null) this.frontend_validation[idx].numErrors = errors;
      if (data !== null) this.frontend_validation[idx].data = data;
      if (verified !== null) this.frontend_validation[idx].verified = verified;

      this.FEvalidationSubject.next(this.frontend_validation);
    }
  }

  clearProgress() {
    // this.uploadStepSubject.next(-1);

    this.steps.forEach(d => {
      d.complete = false;
      d.data = null;
    })

    this.frontend_validation.forEach(d => {
      d.complete = false;
      d.data = null;
      d.numErrors = null;
      d.verified = null;
    })

  }

  checkIDs() {
    this.data.forEach((d: any) => {
      // Check if the IDs are correct
      if (d.privatePatientID) {
        d['originalID'] = d.privatePatientID;
        d['id_check'] = this.idSvc.checkPatientID(d.privatePatientID);
        d['id_okay'] = d.id_check['id'] === d.originalID;
      }
    });


    let badIDs = this.data.filter((d: any) => d.id_okay === false);
    this.updateValidation("check_ids", true, badIDs.length, badIDs);


  }

  convertIDs(convert: boolean) {
    if (convert) {
      this.data.forEach((d: any) => {
        d.privatePatientID = d.id_check.id;
      })
    } else {
      this.data.forEach((d: any) => {
        d.privatePatientID = d.originalID;
      })
    }
    console.log(this.data)
  }

  // Returns a table containing the missing fields per row
  checkRequired(data) {
    this.data = data;
    // Initialize missing field.
    this.data.forEach((d: any) => {
      d.missing = [];
      d.numAliquots = +d.numAliquots;
    });

    for (let field of this.requiredFields) {
      // Filter out the fields that are null or ""
      let filtered = data.filter(d => !d[field] || (d[field] === ""));
      // console.log(filtered)

      filtered.forEach(d => {
        // Append or create missing field
        d.missing.push(field);
      })
    }


    let missing = data.filter(d => d.missing.length > 0);

    // Update the progress.
    this.updateValidation("check_req", true, missing.length, missing);
    // return (missing)
  }

  // Returns a dictionary converting dates to their proper format.
  //
  checkDates(lowerLimit: Date = new Date("2000-01-01")) {
    let date_dict = [];
    let dates = this.data.map((d: any) => d.isolationDate);
    dates = dates.concat(this.data.map((d: any) => d.primarySampleDate));

    // Remove duplicates.
    dates = Array.from(new Set(dates))
    // remove null values
    dates = dates.filter(d => d && d !== "");

    dates.forEach(d => {
      // Check if the date is already in the right format.
      // If so, double check it's within bounds.
      // Necessary b/c new Date("YYYY-mm-dd") has cross-browser weirdness. On Chrome, generates a date which is at 5 pm the day before.
      let correct_format = d.match(/(\d\d\d\d)\-(\d\d)\-(\d\d)/);
      // !!! REMEMBER: dates in Javascript are base 0.  Because...
      let converted = correct_format ? new Date(correct_format[1], correct_format[2] - 1, correct_format[3]) : new Date(d);
      let today = new Date();

      // Check date is within realisitic bounds
      let withinBounds = (converted <= today) && (converted >= lowerLimit);

      let converted_string = this.datePipe.transform(converted, "dd MMMM yyyy");
      let converted_numeric = this.datePipe.transform(converted, "yyyy-MM-dd");

      let date_match = converted_string === d;

      date_dict.push({ "original date": d, "modified date": converted_string, new_date: converted_numeric, date_withinBound: withinBounds, date_match: date_match })
    })

    // Filter out only the weirdos
    date_dict = date_dict.filter(d => !d.date_withinBound || !d.date_match);

    this.data.forEach((d: any) => {
      let idxIsolation = date_dict.findIndex(dict => dict["original date"] === d.isolationDate);
      let idxPrimary = date_dict.findIndex(dict => dict["original date"] === d.primarySampleDate);

      if (idxIsolation > -1) {
        d.isolationDate = date_dict[idxIsolation]["new_date"];
      }

      if (idxPrimary > -1) {
        d.primarySampleDate = date_dict[idxPrimary]["new_date"];
      }
    })

    this.updateValidation("parse_dates", true, date_dict.length, date_dict);

    // Remove the numeric form of the date from what will be passed back to the front-end.
    date_dict.forEach(d => {
      delete d.new_date;
    })

    return ({ data: this.data, dict: date_dict });
  }

  createSampleIDs() {
    let err_ct = 0;


    this.data.forEach((d: any) => {
      if ((!d.sampleLabel) || (!d.isolationDate) || (!d.sampleType)) {
        err_ct += 1;
      }
      if (!d.creatorInitials) {
        // d.creatorInitials = `${this.user.given_name[0]}${this.user.family_name[0]}`;
        d.creatorInitials = "mp"
      }
      d['sampleID'] = `${d.creatorInitials}${d.sampleLabel}_${d.sampleType}${d.isolationDate}`;
      // d['sampleID'] = `${d.creatorInitials}${d.timepointID}_${d.sampleType}${d.isolationDate}`;
    })

    this.updateValidation("create_sampleID", true, err_ct);
    console.log(this.data);
  }

  // Catch duplicate sample IDs.
  // Combine their aliquot count.
  checkDupes(data) {

    data.forEach(d => {
      d['id'] = d.sampleID + d.location;
    })


    let dupe_rows = _(data)
      .groupBy('id')
      .map(v => _.merge(
        {
          numRows: v.length,
          sampleID: v[0].sampleID,
          location: v[0].location,
          samples: v,
          to_save: v[0],
          totalAliquots: _.sumBy(v, 'numAliquots')
        }))
      .filter(d => d.numRows > 1)
      .value();

    let dupeRow_count = sum(dupe_rows, (d: any) => d.numRows);

    this.updateValidation("combine_dupes", true, dupeRow_count, dupe_rows);

  }


  // Removes fields from each object in an array of objects.
  dropCols(data, cols, copy = true) {
    let filtered;
    if (copy) {
      filtered = _.cloneDeep(data)
    } else {
      filtered = data;
    }

    filtered.forEach(d => {
      cols.forEach(col_name => {
        delete d[col_name];
      })
    })

    return (filtered)
  }

  // --- MERGE FUNCTIONS ---



}
