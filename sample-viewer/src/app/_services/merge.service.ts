import { Injectable } from '@angular/core';

import { union, intersection, difference, uniq, cloneDeep, flatMapDeep } from 'lodash';

@Injectable({
  providedIn: 'root'
})

export class MergeService {

  constructor() { }

  /*
  merge function: mimics pandas.merge to combine two arrays of objects
  Note: for now, you can only merge on a single field, not many.
   */
  merge(left: Object[], right: Object[], left_on: string, right_on: string, how, method, indicator = true) {
    // Following pandas.merge syntax for the most part.
    let ids = this.getIDsInCommon(left, right, left_on, right_on, how);

    let intersected_data = this.keepInnerData(left, right, ids, left_on, right_on);

    let cols = this.getAllCols(intersected_data['left'], intersected_data['right']);

    let merged = [];

    for (let id of ids) {
      let row = {};

      // TODO: check length.
      let right_data = intersected_data['right'] ? intersected_data['right'].filter(d => d[right_on] === id) : [];
      let left_data = intersected_data['left'] ? intersected_data['left'].filter(d => d[left_on] === id) : [];

      if (indicator) {
        if ((right_data.length === 1) && (left_data.length === 1)) {
          row["_merge"] = "both"
        } else if (right_data.length === 1) {
          row["_merge"] = "right_only"
        } else if (left_data.length === 1) {
          row["_merge"] = "left_only"
        } else {
        }
      }

      right_data = right_data[0];
      left_data = left_data[0];

      for (let col of cols) {
        row[col + "_x"] = left_data ? left_data[col] : undefined;
        row[col + "_y"] = right_data ? right_data[col] : undefined;
      }

      merged.push(row);
    }

    return (merged)
  }


  getAllCols(left_data, right_data, special_cols = []) {
    // Grab whatever columns exist in the data
    let cols = [];

    // Double check that the data is an array of objects...
    if (left_data && (left_data.map(d => typeof (d) === "object").every(d => d))) {
      left_data.forEach(d => cols = cols.concat(Object.keys(d)));
    }
    if (right_data && (right_data.map(d => typeof (d) === "object").every(d => d))) {
      right_data.forEach(d => cols = cols.concat(Object.keys(d)));
    }

    // Create set of columns; ignore columns like _id from display
    return (Array.from(new Set(cols)).filter(d => !special_cols.includes(d)));
  }


  getIDsInCommon(left, right, left_on, right_on, how): string[] {
    // Find overlapping IDs; only merge these IDs.
    let left_ids = left ? left.map(d => d[left_on]) : [];
    let right_ids = right ? right.map(d => d[right_on]) : [];

    let ids: string[];

    switch (how) {
      case 'left':
        ids = intersection(left_ids, right_ids);
        ids = ids.concat(difference(left_ids, right_ids));
        break;
      case 'right':
        ids = intersection(left_ids, right_ids);
        ids = ids.concat(difference(right_ids, left_ids));
        break;
      case 'outer':
        ids = union(left_ids, right_ids);
        break;
      case 'inner':
        ids = intersection(left_ids, right_ids);
        break;
      default:
        ids = intersection(left_ids, right_ids);
    }

    return (ids)
  }

  keepInnerData(left, right, ids, left_on, right_on) {
    // Remove any data not in the intersection between the two.
    let left_data = left ? left.filter(d => ids.includes(d[left_on])) : undefined;
    let right_data = right ? right.filter(d => ids.includes(d[right_on])) : undefined;

    return ({ left: left_data, right: right_data });
  }

  updateLocations(left, right) {
    let new_loc = this.merge(left, right, "lab", "lab", "outer", "merge");
    return (new_loc)
  }


  mergeSampleData(left_data, right_data, left_on = "sampleID", right_on = "sampleID", how = "right", method = "merge", ignoreCols = ["_id", "_score", "_version"]) {
    let merged = this.merge(left_data, right_data, left_on, right_on, how, method);

    // Create a new ['location'] object to store the merged locations
    // These will be the concatenation of the locations, with the metadata updated.
    merged.forEach(sample => {
      sample['location'] = this.updateLocations(sample['location_x'], sample['location_y']);
    })

    console.log('locations updated!')
    console.log(merged)

    let displayedColumns = this.getAllCols(left_data, right_data);
    // sort displayedColumns
    displayedColumns = uniq(['sampleID'].concat(displayedColumns.sort()));
    // remove cols to ignore-- namely _id-- since it's used internalyl and shouldn't be shown.
    displayedColumns = difference(displayedColumns, ignoreCols);

    let locationColumns = this.getAllCols(flatMapDeep(left_data, d => d.location), flatMapDeep(right_data, d => d.location));

    return ({ merged: merged, displayedColumns: displayedColumns, locationColumns: locationColumns });
  }


  // Outer function to actually merge _x properties with _y.
  compressMergedSamples(merged) {
    // First, replace the 'location' with the consolidated form
    let compressed = cloneDeep(merged);

    compressed.forEach(sample => {
      // Location is weird; want to concatenate together the results
      sample['location'] = this.compressMergedData(sample['location'], "replace_left_first");
      sample = this.updateMergedVals(sample, "_id", "replace_left_first");

      delete sample['location_x'];
      delete sample['location_y'];
    })

    compressed = this.compressMergedData(compressed);
    return (compressed);
  }


  compressMergedData(merged, method = "replace_left") {
    // Create a deep copy of merged so we can edit it as we like.
    // let compressed = cloneDeep(merged);

    merged.forEach(sample => {
      let cols = Object.keys(sample);

      let merged_cols = cols.filter(d => d.includes("_x") || d.includes("_y"));

      let col_pairs = uniq(merged_cols.map(d => d.replace("_x", "").replace("_y", "")));

      for (let column of col_pairs) {
        // Update with the new value: the left, the right, or (default) an array of both.
        // If method = "replace_left_first", replaces with _y. If there's no _y, replaces w/ _x
        sample = this.updateMergedVals(sample, column, method);
      }
    })

    return (merged);
  }

  // Actual function to change values
  // If `replace_left`, _y property will be the final value
  // if `replace_right`, _x property will be the final value
  // if `replace_left_first`, _y property will take precedence and be the final value. If no _y property, _x will be used.
  // default: values get appended together in an array of two.
  updateMergedVals(sample, column, method) {
    switch (method) {
      case "replace_left":
        sample[column] = sample[column + "_y"];
        break;
      case "replace_right":
        sample[column] = sample[column + "_x"];
        break;
      case "replace_left_first":
        sample[column] = (sample[column + "_y"] || sample[column + "_y"] === 0) ? sample[column + "_y"] : sample[column + "_x"];
        break;
      default:
        sample[column] = [sample[column + "_x"], sample[column + "_y"]];
    }
    // Remove the _x and _y vars
    delete sample[column + "_x"];
    delete sample[column + "_y"];

    return (sample)
  }

}
