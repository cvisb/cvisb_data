import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PutService {

  constructor() { }

// Generic function to add data to a given endpoint on the API
// First checks if the data already exists in the backend, based on the unique identifier
// If found, merges in the _id ES unique ID into the newData object so the data will
// merge/update the data on the backend, not append a new object.
// Lastly,
  put(newData: any, endpoint: string) {

  }

  getIDs(newData: any, endpoint: string) {}
}
