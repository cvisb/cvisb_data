import { Injectable } from '@angular/core';

import { cloneDeep } from 'lodash';

import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class Nested2longService {

  constructor(private apiSvc: ApiService) {
  }

  prep4download(data, cols2unnest, cols2remove = []) {
    console.log(data)
    let flattened = this.nested2long(data, cols2unnest);

    flattened = this.apiSvc.dropCols(flattened, cols2remove, false);

    return (flattened);
  }



  // (1) flattens arrays; duplicates sample metadata for multiple locations
  // (2) calls denestObjects to flatten objects
  nested2long(data, cols2unnest?) {
    let flattened = [];

    data.forEach(d => {
      let keys = Object.keys(d);

      let unnest = cols2unnest ? cols2unnest : keys;

      keys.forEach(key => {
        // For every array of objects, duplicates the row and creates a long dataset.
        if (typeof (d[key]) === "object" && Array.isArray(d[key]) && unnest.includes(key)) {
          d[key].forEach(loc => {
            let entry = cloneDeep(d);
            entry[key] = loc;
            flattened.push(entry);
          })
        }
      })
    })

    // After lengthening the dataset, splay out the object to wide columns.
    flattened = this.denestObjects(flattened);
    console.log(flattened)
    return (flattened)
  }

  // If a key contains an object, will splay out the object
  denestObjects(data) {
    data.forEach(sample_row => {
      let keys = Object.keys(sample_row);

      keys.forEach(key => {
        // For every object (not array of objects), unnest that sucker
        if (sample_row[key] && typeof (sample_row[key]) === "object" && !Array.isArray(sample_row[key])) {
            let nested_cols = Object.keys(sample_row[key]);
            nested_cols.forEach(col => {
              sample_row[col] = sample_row[key][col];
            })
            // remove the nested var.
            delete sample_row[key];
          }
      })
    })
    return (data);
  }

}
