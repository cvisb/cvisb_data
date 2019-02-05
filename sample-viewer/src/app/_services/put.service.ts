import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map } from "rxjs/operators";
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
  put(newData: any, endpoint: string, uniqueID: string = 'identifier') {
    this.getIDs(newData, endpoint, uniqueID).subscribe(id_dict => {
      console.log(id_dict)

      for (let dict_row of id_dict) {
        console.log(newData)
        console.log(dict_row.uniqueID)

        // id_dict.forEach((dict_row) => {
        // check if index is unique, exists
        let filtered = newData.filter((d) => d[uniqueID] === dict_row.uniqueID);
        console.log(filtered)
        if (filtered.length === 1) {

          let idx = newData.findIndex((d) => d[uniqueID] === dict_row.uniqueID);
          console.log(idx)

          newData[idx]["_id"] = dict_row['_id'];
        } else {
          console.log("Oops! More than one record has that unique ID.  Check whatever the IDs are of what you're trying to insert and try again.")
          return (null);
        }
      }
      // })
      console.log('attempting to add new record with generic function')
      console.log(newData);

      this.http.put<any[]>(`${environment.api_url}/api/${endpoint}`,
        this.jsonify(newData),
        {
          headers: new HttpHeaders()
        }).subscribe(resp => {
          console.log(resp)
        },
          err => {
            console.log(err)
          })
    })
  }


  getIDs(newData: any, endpoint: string, uniqueID: string) {
    let ids = newData.map((d) => d[uniqueID]).join(",");

    return this.http.get<any[]>(`${environment.api_url}/api/${endpoint}/query`, {
      observe: 'response',
      headers: new HttpHeaders()
        .set('Accept', 'application/json'),
      params: new HttpParams()
        .set('q', `${uniqueID}:${ids}`)
    }).pipe(
      map(data => {
        let files = data['body']['hits'];

        let id_dict = files.map((d: any) => {
          return ({
            '_id': d['_id'],
            uniqueID: d[uniqueID]
          })
        }
        );

        return (id_dict);
      }))
  }

  // Function to convert to a json object to be inserted by ES
  jsonify(arr: any[]): string {
    let json_arr = [];

    for (let record of arr) {
      json_arr.push(JSON.stringify(record))
    }
    return (json_arr.join("\n"))
  }
}
