import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { environment } from "../../environments/environment";


@Injectable({
  providedIn: 'root'
})
export class PutService {

  constructor(public http: HttpClient) { }

  // Generic function to add data to a given endpoint on the API
  // (1) First checks if the data already exists in the backend, based on the unique identifier
  // (2) If found, merges in the _id ES unique ID into the newData object so the data will
  // merge/update the data on the backend, not append a new object.
  // (3) To all, appends the dateModified to be the current date. [?-- should happen on backend?]
  // (4) Lastly, adds the data to the backend using the PUT endpoint.
  put(newData: any, endpoint: string) {

  }

  getIDs(newData: any, endpoint: string, uniqueID: string = 'identifier') {
    let ids = newData.map((d) => d[uniqueID]).join(",");

    this.http.get<any[]>(`${environment.api_url}/api/${endpoint}/query`, {
      observe: 'response',
      headers: new HttpHeaders()
        .set('Accept', 'application/json'),
      params: new HttpParams()
        .set('q', `${uniqueID}:${ids}`)
    }).subscribe(data => {
      let files = data['body']['hits'];
      console.log(data)

      let id_dict = files.map((d: any) => {
        return ({
          'id': d['_id'],
          uniqueID: d[uniqueID]
        })
      }
    );

    console.log(id_dict);
    },
      err => {
        console.log('Error in getting files')
        // console.log(err)
      })


  }
}
