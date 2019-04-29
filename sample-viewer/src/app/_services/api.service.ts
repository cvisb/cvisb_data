// Series of generic wrappers around common functionalities across API endpoints.
// For instance: a generic loop to wipe an entire endpoint.

import { Injectable } from '@angular/core';

import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, Subject, BehaviorSubject, throwError } from 'rxjs';
import { map, catchError } from "rxjs/operators";

import { environment } from "../../environments/environment";

// services
import { MyHttpClient } from './http-cookies.service';

// models


@Injectable({
  providedIn: 'root'
})

export class ApiService {

  constructor(
    public myhttp: MyHttpClient,
  ) {
  }

  // --- GET ---
  // Generic GET to access a single document with a particular ID.
  getOne(endpoint: string, id: string, idVar: string = 'identifier') {
    return this.myhttp.get<any[]>(`${environment.api_url}/api/${endpoint}/query`, {
      observe: 'response',
      headers: new HttpHeaders()
        .set('Accept', 'application/json'),
      params: new HttpParams()
        .set('q', `${idVar}:\"${id}\"`)
    }).pipe(
      map(data => {
        if (data['body']['total'] === 1) {
          // One result found, as expected.
          return (data['body']['hits'][0])
        } else {
          console.log("More than one object returned. Check if your ID is unique!")
          console.log(data)
        }
      }),
      catchError(e => {
        console.log(e)
        throwError(e);
        return (new Observable<any>())
      })
    )
  }

  // Generic getAll, which calls fetchAll
  getAll(endpoint: string, qString): Observable<any[]> {
    let all_data = [];

    let params = new HttpParams()
      .set('q', qString)
      .append('fetch_all', "true");

    return this.myhttp.get<any[]>(`${environment.api_url}/api/patient/query`, {
      observe: 'response',
      headers: new HttpHeaders()
        .set('Accept', 'application/json'),
      params: params
    }).pipe(
      map((res: any[]) => {
        console.log('result of get all');
        console.log(res);

        // let patientArray = res["body"]['hits'].map(patient => {
        //   return ((patient));
        // });

        return (res['body'['hits']])
      }
      )
    );
  }

  // Generic function to pull out the ES `_ids` for all entries in an endpoint.
  getESIDs(endpoint: string) {
    return this.myhttp.get<any[]>(`${environment.api_url}/api/${endpoint}/query`, {
      observe: 'response',
      params: new HttpParams()
        .set("q", "__all__")
        .set("facets", "_id")
        .set("facet_size", "10000")
        .set("size", "0"),
      headers: new HttpHeaders()
        .set('Accept', 'application/json')
    }).pipe(
      map(data => {
        let df = data['body']['facets']['_id']['terms'];
        let ids = df.map(d => d.term);
        console.log(ids)

        return (ids);

      }))
  }

  // getIDs(newData: any, endpoint: string, uniqueID: string) {
  //   let ids = newData.map((d) => d[uniqueID]).join(",");
  //
  //   return this.myhttp.get<any[]>(`${environment.api_url}/api/${endpoint}/query`, {
  //     observe: 'response',
  //     headers: new HttpHeaders()
  //       .set('Accept', 'application/json'),
  //     params: new HttpParams()
  //       .set('q', `${uniqueID}:${ids}`)
  //   }).pipe(
  //     map(data => {
  //       if (data) {
  //         let files = data['body']['hits'];
  //
  //         if (!files) {
  //           return (null)
  //         }
  //         let id_dict = files.map((d: any) => {
  //           return ({
  //             '_id': d['_id'],
  //             uniqueID: d[uniqueID]
  //           })
  //         }
  //
  //         );
  //
  //         return (id_dict);
  //       }
  //     }))
  // }

  // --- PUT ---
  // Generic function to add data to a given endpoint on the API
  put(endpoint: string, newData: any): Observable<any> {

    // this.getIDs(newData, endpoint, uniqueID).subscribe(id_dict => {

    // Check if there are already duplicates within the index.
    // let ids = id_dict.map((d) => d.uniqueID);
    // let unique_ids = new Set(ids);

    // if (Array.from(unique_ids).length !== ids.length) {
    //   console.log("Oops! The endpoint contains entries with duplicate identifers.  Exiting...");
    //   return (null);
    // }

    // id_dict.forEach((dict_row) => {
    //   // check if index is unique, exists within newData
    //   if (newData.filter((d) => d[uniqueID] === dict_row.uniqueID).length === 1) {
    //
    //     let idx = newData.findIndex((d) => d[uniqueID] === dict_row.uniqueID);
    //
    //     newData[idx]["_id"] = dict_row['_id'];
    //   } else {
    //     console.log("Oops! More than one record in the new documents has the same unique ID.  Check whatever the IDs are of what you're trying to insert and try again.")
    //     return (null);
    //   }
    // })
    if (newData) {
      console.log('adding new data')
      return this.myhttp.put<any[]>(`${environment.api_url}/api/${endpoint}`,
        this.jsonify(newData),
        {
          headers: new HttpHeaders()
        });

      // .pipe(
      //   map(resp => {
      //     console.log(resp)
      //     // return (new Observable<any>(resp))
      //   }),
      //   catchError(e => {
      //     console.log(e)
      //     throwError(e);
      //     return (new Observable<any>(e))
      //   })
      // )?

    } else {
      console.log('no data to add')
    }
  }

// Generic PUT function, done in `size` pieces.
// Executed in a cascade, where the previous API completes before
    putPiecewise(endpoint: string, newData: any, size: number = 50): Observable<any> {
      let numChunks = Math.ceil(newData.length / size);
      return(null)
    }


  // Function to convert to a json object to be inserted by ES
  jsonify(arr: any[]): string {
    let json_arr = [];

    for (let record of arr) {
      json_arr.push(JSON.stringify(record))
    }
    return (json_arr.join("\n"))
  }


  // --- DELETE ---
  // Generic function to delete a single record.
  deleteObject(endpoint: string, id: string) {
    console.log("attempting to delete obj: " + id)
    // TODO: build-in dialoge box to confirm?
    this.myhttp.delete(`${environment.api_url}/api/${endpoint}/${id}`)
      .subscribe(resp => {
        console.log(resp)
      },
        err => {
          console.log(`Error in deleting object ${id} from endpoint /${endpoint}`)
          console.log(err)
        }
      )
  }

  // Generic function to delete a single record.
  wipeEndpoint(endpoint: string) {
    console.log("attempting to delete all objects from endpoint")
    // TODO: build-in dialoge box to confirm / controls so not anyone can access

    this.getESIDs(endpoint).subscribe(ids => {
      console.log("list of IDs to delete:")
      console.log(ids);

      for (let id of ids) {
        this.deleteObject(endpoint, id);
      }
    })
  }

}
