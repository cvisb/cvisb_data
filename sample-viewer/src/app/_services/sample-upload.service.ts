import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { DatePipe } from '@angular/common';

import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { HttpParams } from '@angular/common/http';
import { catchError, finalize } from "rxjs/operators";
import { of } from "rxjs";

import { CvisbUser } from '../_models';
import { AuthService } from './auth.service';
import { CheckIdsService } from './check-ids.service';
import { MergeService } from './merge.service';
import { ApiService } from './api.service';

import { nest, sum } from 'd3';
import _ from 'lodash';

@Injectable({
  providedIn: 'root'
})

export class SampleUploadService {
  today = new Date();

  user: CvisbUser;
  data: Object[]; // copy of sample data to be uploaded.

  // List of properties that will be nested together.
  locationCols: string[] = ["lab", "numAliquots", "freezerID", "freezerRack", "freezerBox", "freezerBoxCell"];
  requiredFields = ["sampleLabel", "privatePatientID", "sampleType", "sampleGroup", "isolationDate", "lab", "numAliquots"];

  // Checks and converts these fields into arrays
  arrayFields: string[] = ["sourceSampleID", "sourceSampleType", "protocolVersion", "protocolURL", "alternateIdentifier",
    "freezerBox", "freezerID", "freezerRack", "freezerBoxCell"];
  // delimiters to split strings into arrays for array fields.
  // Need two separate delimiters: commas are needed for .tsvs, since exported arrays from Angular come in as comma-delimited.
  // BUT-- .csvs obviously can't handle extra commas, so using / as a csv array separator.
  arrayDelim: string[] = [",", "/"];

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
    { id: "check_req", complete: false, label: "Checking for required fields", numErrors: null, data: null, fatal: true },
    { id: "delete_extra", complete: false, label: "Deleting extra rows", numErrors: null, verified: null, fatal: false },
    { id: "check_ids", complete: false, label: "Checking patient ID structure", numErrors: null, verified: null, fatal: false },
    { id: "check_dupes", complete: false, label: "Checking duplicate sample IDs", numErrors: null, verified: null, fatal: true },
    { id: "combine_dupes", complete: false, label: "Combining duplicate samples", numErrors: null, verified: null, fatal: false },
    // { id: "check_timepoints", complete: false, label: "Checking timepoint IDs (visit codes)", numErrors: null, verified: null, fatal: false },
    { id: "parse_dates", complete: false, label: "Parsing dates", numErrors: null, verified: null, fatal: false },
    { id: "create_sampleID", complete: false, label: "Creating unique sample ID", numErrors: null, fatal: true },
    // { id: "check_locations", complete: false, label: "Checking location changes", numErrors: null },
  ]



  public uploadSamplesSubject: BehaviorSubject<Object[]> = new BehaviorSubject<Object[]>([]);
  public uploadSamplesState$ = this.uploadSamplesSubject.asObservable();

  public previewDifferencesSubject: BehaviorSubject<Object> = new BehaviorSubject<Object>({});
  public previewDifferencesState$ = this.previewDifferencesSubject.asObservable();

  public uploadStepSubject: BehaviorSubject<number> = new BehaviorSubject<number>(-1);
  public uploadStepState$ = this.uploadStepSubject.asObservable();

  public progressSubject: BehaviorSubject<Object[]> = new BehaviorSubject<Object[]>(this.steps);
  public progressState$ = this.progressSubject.asObservable();

  public progressSubject2: BehaviorSubject<Object[]> = new BehaviorSubject<Object[]>(this.stepsForm);
  public progressState2$ = this.progressSubject2.asObservable();

  public FEvalidationSubject: BehaviorSubject<Object[]> = new BehaviorSubject<Object[]>(this.frontend_validation);
  public FEvalidationState$ = this.FEvalidationSubject.asObservable();

  public loadingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public loadingState$ = this.loadingSubject.asObservable();


  constructor(
    private datePipe: DatePipe,
    private authSvc: AuthService,
    private idSvc: CheckIdsService,
    private mergeSvc: MergeService,
    private apiSvc: ApiService
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
  // No going back from this point! (well, there is, since I made a copy)
  getCleanedData(vars2delete = ['id_check', 'id_okay', 'missing', 'originalID', 'id', 'visitCodeDisagree', 'originalVisitCode',
    // patient metadata properties
    'patientID', 'cohort', 'outcome', 'country', 'alternateIdentifier', 'infectionYear', 'dateModified_patient'].concat(this.locationCols)) {
    // turn on loading indicator
    this.loadingSubject.next(true);

    let data_copy = _.cloneDeep(this.data);

    // turn location into a nested data object.
    data_copy = this.nestLocations(data_copy);


    // Remove anything that needs to be removed.
    data_copy = this.apiSvc.dropCols(data_copy, vars2delete);

    data_copy.forEach((d: any) => {
      d['dateModified'] = this.datePipe.transform(this.today, "yyyy-MM-dd");
    })

    console.log("Front-end validated data")
    console.log(data_copy);

    // Check if there are any updates to existing data
    // let sampleIDs = `sampleID:"${data_copy.map(d => d.sampleID).join('","')}"`;

    this.apiSvc.fetchAll('sample', new HttpParams().set("q", "__all__")).pipe(
      catchError(
        e => {
          console.log(e)
          this.loadingSubject.next(false);
          return (of([]))
        }),
      finalize(() => this.loadingSubject.next(false))
    )
      .subscribe((samples) => {
        console.log('samples from call to backend')
        console.log(samples);

        let mergedObj = this.mergeSvc.mergeSampleData(samples, data_copy);

        // Save the merged form, doing the actual merge to combine old/new data.
        data_copy = this.mergeSvc.compressMergedSamples(mergedObj.merged);

        this.previewDifferencesSubject.next(mergedObj);


        console.log("After data merge")
        console.log(mergedObj)
        console.log(data_copy);

        this.uploadSamplesSubject.next(data_copy);
      });


    // let mergedObj = this.mergeSvc.mergeSampleData(this.oldData, data_copy);
    //
    // // Save the merged form, doing the actual merge to combine old/new data.
    // data_copy = this.mergeSvc.compressMergedSamples(mergedObj.merged);
    //
    // this.previewDifferencesSubject.next(mergedObj);
    //
    //
    // console.log("After data merge")
    // console.log(mergedObj)
    // console.log(data_copy);
    //
    // this.uploadSamplesSubject.next(data_copy);

  }



  updateProgress(id: string, status: boolean) {
    let idx = this.steps.findIndex(d => d.id === id);



    if (idx > -1) {
      // Auto-advance if the file has been loaded.
      if ((idx === 0) && status) this.uploadStepSubject.next(idx);
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

    this.steps.forEach((d) => {
      d.complete = false;
      d.data = null;
    })

    this.frontend_validation.forEach((d) => {
      d.complete = false;
      d.data = null;
      d.numErrors = null;
      d.verified = null;
    })

    // Update BehaviorSubjects
    this.previewDifferencesSubject.next({});
    this.uploadSamplesSubject.next([]);
    this.progressSubject.next(this.steps);
  }

  // Converts any values which are meant to be arrays into arrays. Splits on this.arrayDelim
  convert2Array() {
    this.data.forEach((d) => {
      this.arrayFields.forEach(col => {
        d[col] = (d[col] && d[col] !== "") ? _.flatMapDeep(d[col].split(this.arrayDelim[0]).map(d => d.split(this.arrayDelim[1]))) : null;
      })
    })
  }

  checkIDs() {
    // just for now... testing...
    // this.apiSvc.getAll("patient", "cohort:Lassa");

    this.data.forEach((d: any) => {
      // Check if the IDs are correct
      if (d.privatePatientID) {
        d['originalID'] = d.privatePatientID;
        d['originalVisitCode'] = d.visitCode;
        d['id_check'] = this.idSvc.checkPatientID(d.privatePatientID);
        d['id_okay'] = d.id_check['id'] === d.originalID;
        d['visitCodeDisagree'] = (d.visitCode) && (d.visitCode !== d.id_check['timepoint']);
      }
    });


    let badIDs = this.data.filter((d: any) => d.id_okay === false);
    this.updateValidation("check_ids", true, badIDs.length, badIDs);
  }

  // Function to actually change the IDs, visitCodes.
  // Called from app-frontend-validation, depending on the radio button selection
  convertIDs(convert: boolean) {
    if (convert) {
      this.data.forEach((d: any) => {
        // If there's no conversion possible, revert to the originalID
        d.privatePatientID = d.id_check.id ? d.id_check.id : d.originalID;
        d.visitCode = d.id_check.timepoint ? d.id_check.timepoint : d.originalVisitCode;
      })
    } else {
      this.data.forEach((d: any) => {
        d.privatePatientID = d.originalID;
        d.visitCode = d.originalVisitCode;
      })
    }
  }

  // Returns a table containing the missing fields per row
  checkRequired(data) {
    this.data = data;

    // Initialize missing field.
    this.data.forEach((d: any) => {
      d.missing = [];
      d.numAliquots = +d.numAliquots;
      // clean up case of
      d.sampleGroup = (d.sampleGroup && d.sampleGroup !== "") ? d.sampleGroup.toLowerCase() : null;
      // clean up "" strings-- if the type is not a string (e.g. bool, date, number)
      d.primarySampleDate = d.primarySampleDate !== "" ? d.primarySampleDate : null;
      d.dilutionFactor = d.dilutionFactor !== "" ? d.dilutionFactor : null;
      d.freezingBuffer = d.freezingBuffer !== "" ? d.freezingBuffer : null;
      d.visitCode = d.visitCode !== "" ? d.visitCode : null;
      // clean AVLinactivated; should be a boolean or null.
      d['AVLinactivated'] = d['AVLinactivated'] ? (d['AVLinactivated'].toUpperCase().trim() === "TRUE" ? true : (d['AVLinactivated'].toUpperCase().trim() === "FALSE" ? false : null)) : null;
    });

    // Convert to arrays, as needed.
    this.convert2Array();

    for (let field of this.requiredFields) {
      // Filter out the fields that are null or ""
      // NOTE: can't check for !d[field], since 0 values are falsey.
      let filtered = this.data.filter(d => d[field] === undefined || (d[field] === ""));
      // console.log(filtered)

      filtered.forEach((d: any) => {
        // Append or create missing field
        d.missing.push(field);
      })
    }


    let missing = this.data.filter((d: any) => d.missing.length > 0);

    // Update the progress.
    this.updateValidation("check_req", true, missing.length, missing);
  }

  // Returns a dictionary converting dates to their proper format.
  checkDates(lowerLimit: Date = new Date("2000-01-01")) {
    let date_dict = [];
    let dates = this.data.map((d: any) => d.isolationDate);
    dates = dates.concat(this.data.map((d: any) => d.primarySampleDate));

    // Remove duplicates.
    dates = Array.from(new Set(dates))
    // remove null values
    dates = dates.filter(d => d && d !== "" && d !== "null");

    dates.forEach((d) => {
      // Check if the date is already in the right format.
      // If so, double check it's within bounds.
      // Necessary b/c new Date("YYYY-mm-dd") has cross-browser weirdness. On Chrome, generates a date which is at 5 pm the day before.
      let correct_format = d.match(/(\d\d\d\d)\-(\d\d)\-(\d\d)/);

      // !!! REMEMBER: months in Javascript are base 0.  Because...
      let converted = correct_format ? new Date(correct_format[1], correct_format[2] - 1, correct_format[3]) : new Date(d);

      // Check date is within realisitic bounds
      let withinBoundsErr: string;
      let converted_string: string;
      let converted_numeric: string;

      if (String(converted) === "Invalid Date") {
        withinBoundsErr = "date is invalid! Convert to YYYY-MM-DD";
      }
      else {
        if (converted > this.today) {
          withinBoundsErr = "date is after today";
        } else if (converted < lowerLimit) {
          withinBoundsErr = `date is before ${this.datePipe.transform(lowerLimit, "dd MMMM yyyy")}; are you sure?`;
        } else {
          withinBoundsErr = null;
        }

        converted_string = this.datePipe.transform(converted, "dd MMMM yyyy");
        converted_numeric = this.datePipe.transform(converted, "yyyy-MM-dd");
      }
      // binary if the inputted date was okay.
      let date_match = converted_numeric === d;

      date_dict.push({ "original date": d, "modified date": converted_string, new_date: converted_numeric, "date outside range": withinBoundsErr, date_match: date_match })
    })

    // Filter out only the weirdos
    date_dict = date_dict.filter((d) => d['date outside range'] || !d.date_match);

    // Remove the indicator for the weirdos
    date_dict = this.apiSvc.dropCols(date_dict, ["date_match"], false);

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

    // Sort so those outside range are highlighted first.
    date_dict.sort((a, b) => b["date outside range"] < a["date outside range"] ? -1 : 1);

    this.updateValidation("parse_dates", true, date_dict.length, date_dict);

    // Remove the numeric form of the date from what will be passed back to the front-end.
    date_dict.forEach((d) => {
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
        d.creatorInitials = (this.user && this.user.given_name && this.user.family_name) ? `${this.user.given_name[0]}${this.user.family_name[0]}` : "";
      }
      // Make sure to replace any spaces in the sampleLabel with _ so ES is happier.
      d['sampleID'] = `${d.creatorInitials.toLowerCase()}-${d.sampleLabel.replace(/\s/g, "_")}_${d.sampleType}_${d.isolationDate}`;
    })

    this.updateValidation("create_sampleID", true, err_ct);
    console.log(this.data);
  }

  getDupes(items) {
    let dupes = [];

    // Remove the location columns from the check; they shouldn't be considered a problem for combining data.
    let colNames = _.difference(items.keys, this.locationCols);

    // If there's more than one entry for a sampleID, check that the metadata agree.
    if (items.values.length > 1) {
      for (let colName of colNames) {

        let unique_vals = _.uniqWith(_.map(items.values, colName), _.isEqual);
        if (unique_vals.length > 1) {
          dupes.push({ column: colName, values: unique_vals })
        }
      }
    }
    return (dupes);
  }


  checkDupes() {
    // Group by the sampleID; attach all values; find unique keys for each sample group.
    let data_by_id = _(this.data)
      .groupBy('sampleID')
      .map((items, id) => {
        return {
          sampleID: id,
          keys: _.uniq(_.flatten(_.map(items, Object.keys))),
          values: items,
          samples: items,
        };
      }).value();

    // Find the disagreements for each sample group
    // If there are multiple values for a given variable within a sample ID, flag it
    data_by_id.forEach((d:any) => {
      d['disagreements'] = this.getDupes(d);
      d['highlight'] = _.uniq(_.flatMap(d.disagreements, 'column'));
    })

    // Isolate the values that disagree.
    let disagreements = data_by_id.filter((d:any) => d.disagreements.length > 0);
    disagreements = _.cloneDeep(disagreements)

    disagreements.forEach((d) => {
      delete d['keys'];
      d['values'] = this.apiSvc.dropCols(d.values, ['creatorInitials', 'id_check', 'id_okay', 'missing', 'originalID', 'id'], false);
    })

    this.updateValidation("check_dupes", true, disagreements.length, disagreements);

  }

  // Catch duplicate sample IDs with the same locations.
  // Combine their aliquot count.
  combineDupes() {
    this.data.forEach((d: any) => {
      d['id'] = d.sampleID + d.lab;
    })

    // Create a copy so we can modify at will and keep the duplicates.
    let dupe_rows = _(_.cloneDeep(this.data))
      .groupBy('id')
      .map((v, id) => _.merge(
        {
          id: id,
          numRows: v.length,
          sampleID: v[0]['sampleID'],
          lab: v[0]['lab'],
          samples: v,
          // array-ize the location properties
          allFreezers: arrayizeLocations(v, "freezerID"),
          allRacks: arrayizeLocations(v, "freezerRack"),
          allBoxes: arrayizeLocations(v, "freezerBox"),
          allFreezerCells: arrayizeLocations(v, "freezerBoxCell"),
          // count the total number of aliquots.
          totalAliquots: _.sumBy(v, 'numAliquots'),
        }))
      .filter(d => d.numRows > 1)
      .value();

    let dupeRow_count = sum(dupe_rows, (d: any) => d.numRows);

    // Update the count by the total number of aliquots for the combined duplicates.
    dupe_rows.forEach(d => {
      // d.to_save.numAliquots = d.totalAliquots;
      d['idx'] = getAllIndices(this.data.map((sample: any) => sample.id), d.id);

      // Remove the duplicates.
      this.removeDupes(d.idx, d);
    })

    // helper function to combine the array values.
    // should combine values into an array.
    // HOWEVER-- nulls aren't valid inputs for an array of strings in ES (sigh)
    // so filtering out null values... people will just have to check and find the locations themselves.
    function arrayizeLocations(v, varName): string[] {
      return (_.flatMapDeep(v, d => d[varName]).filter(d => d));
    }



    // Find the indices of the duplicates.
    // from https://stackoverflow.com/questions/20798477/how-to-find-index-of-all-occurrences-of-element-in-array
    function getAllIndices(arr, val) {
      var indexes = [], i = -1;
      while ((i = arr.indexOf(val, i + 1)) !== -1) {
        indexes.push(i);
      }
      return indexes;
    }


    this.updateValidation("combine_dupes", true, dupeRow_count, dupe_rows);

  }

  removeDupes(indices, obj) {
    for (let i = 0; i < indices.length; i++) {
      if (i !== 0) {
        // remove the element.
        this.data.splice(indices[i], 1);
      } else {
        this.data[indices[i]]['numAliquots'] = obj['totalAliquots'];
        this.data[indices[i]]['freezerID'] = obj['allFreezers'];
        this.data[indices[i]]['freezerRack'] = obj['allRacks'];
        this.data[indices[i]]['freezerBox'] = obj['allBoxes'];
        this.data[indices[i]]['freezerBoxCell'] = obj['allFreezerCells'];
      }
    }
  }



  nestLocations(data) {
    // Create location variable on each, which is an object containing all the individual location properties.
    data.forEach((row: any) => {
      let loc = {};

      this.locationCols.forEach(column => {
        loc[column] = row[column];
      })

      loc['dateModified'] = this.datePipe.transform(this.today, "yyyy-MM-dd");
      loc['updatedBy'] = this.user.name;

      row['location'] = loc;
    })

    // Group by the sampleID and return the locations as an array of objects
    // Save only the first entry of the items.
    // * Assumes that the metadata is equal for all the samples. *
    // Should be a safe assumption
    let data_by_id = _(data)
      .groupBy('sampleID')
      .map((items) => {
        return {
          values: items,
          to_save: items[0],
          location: _.map(items, 'location')
        };
      }).value();

    // Update the location to be an array of location objects.
    data_by_id.forEach(d => {
      d.to_save.location = d.location;
    });

    // Pull out just the first entry, with the array of location objects
    let nested = data_by_id.map(d => d.to_save);


    console.log(data_by_id);
    console.log(nested)

    return (nested);
  }

}
