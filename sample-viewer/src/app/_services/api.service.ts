// Series of generic wrappers around common functionalities across API endpoints.
// For instance: a generic loop to wipe an entire endpoint.

import { Injectable } from '@angular/core';

import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError, forkJoin, of, EMPTY } from 'rxjs';
import { map, catchError, tap, mergeMap, reduce, finalize, expand, pluck } from "rxjs/operators";

import { environment } from "../../environments/environment";

// services
import { MyHttpClient } from './http-cookies.service';
import { cloneDeep, flattenDeep } from 'lodash';

import { nest } from 'd3';

@Injectable({
  providedIn: 'root'
})

export class ApiService {
  public uploadProgressSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public uploadProgressState$ = this.uploadProgressSubject.asObservable();
  public loadingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public loadingState$ = this.loadingSubject.asObservable();


  constructor(
    public myhttp: MyHttpClient,
  ) {
  }

  // --- GET ---
  // Generic GET to access a single document with a particular ID.
  getOne(endpoint: string, id: string, idVar: string = 'identifier', returnAll: boolean = false) {
    return this.myhttp.get<any[]>(`${environment.api_url}/api/${endpoint}/query`, {
      observe: 'response',
      headers: new HttpHeaders()
        .set('Accept', 'application/json'),
      params: new HttpParams()
        .set('q', `${idVar}:\"${id}\"`)
    }).pipe(
      map(data => {
        if (returnAll) {
          return (data['body']['hits']);
        } else {
          if (data['body']['total'] === 1) {
            // One result found, as expected.
            return (data['body']['hits'][0])
          } else {
            console.log("More than one object returned. Check if your ID is unique!")
            console.log(data)
          }
        }
      }),
      catchError(e => {
        console.log(e)
        throwError(e);
        return (new Observable<any>())
      })
    )
  }


  post(endpoint: string, searchString: string, searchParam: string, returnParams: string) {
    let headers = new HttpHeaders()
      // .set('Accept', 'application/json')
      .set('Content-Type', 'application/x-www-form-urlencoded');

    let params = new HttpParams()
      .set("q", searchString)
      .set("scopes", searchParam)
      .set("fields", returnParams)
      .set("size", "1");

    return this.myhttp.post<any[]>(`${environment.api_url}/api/${endpoint}/query`, params, {
      observe: 'response',
      headers: headers
    }).pipe(
      map(data => {
        return (data)
      }),
      catchError(e => {
        console.log(e)
        throwError(e);
        return (new Observable<any>())
      })
    )
  }


  // Sorting function, to convert sort variable into the proper syntax for ES
  // numeric variables should return just their string'd name
  // string variables need to be {string}.keyword
  // and there's a few special cases for nested variables
  sortFunc(sortVar): string {
    let numericVars = ["age", "dateModified"];
    if (numericVars.includes(sortVar) || !sortVar) {
      return (sortVar);
    }

    // custom: nested objects
    if (sortVar === "country") {
      return ("country.name.keyword");
    }

    // custom: locations of sample types
    if (["blood_purple-EDTA", "blood_blue-citrate", "blood_mixed", "blood_unknown",
      "urine", "feces", "organs", "tissue", "plasma", "serum", "plasma_or_serum",
      "buffy_coat", "PBMC", "frozenPBMC-DNA", "frozenPBMC-RNA", "viralRNA",
      "totalRNA", "DNA"].includes(sortVar)) {
      return ("location.numAliquots");
    }

    // Default: string
    // Since any variable which is a string has to be sorted by keyword, doing a bit of transformation:
    return (`${sortVar}.keyword`);
  }


  getMultipleRequests(endpoint, qParamArray, sortVar: string = "", sortDirection?: string): Observable<any> {
    // console.log(qParamArray)
    let batchOfRequests = qParamArray.map(qParams =>
      this.getSorted(endpoint, qParams, sortVar, sortDirection)
        .pipe(
          catchError((err) => of(err))
        )
    );

    return (forkJoin(...batchOfRequests));

    // .subscribe((myResponsesArray: any[]) => {
    //   myResponsesArray.forEach((returnedData, index) => {
    //     console.log(index);
    //     console.log(returnedData);
    //   });
    //   return(myResponsesArray)
    // });
  }

  getSorted(endpoint, qParams, sortVar: string = "", sortDirection?: string, sizeLimit: number = 1000, startIdx: number = 0): Observable<any[]> {

    // this.router.navigate(
    //   [],
    //   {
    //     relativeTo: this.route,
    //     queryParams: { q: qParams.toString() },
    //     queryParamsHandling: "merge", // remove to replace all query params by provided
    //   });

    // console.log(qParams.toString());

    // ES syntax for sorting is `sort=variable:asc` or `sort=variable:desc`
    // BUT-- Biothings changes the syntax to be `sort=+variable` or `sort=-variable`. + is optional for asc sorts
    let sortString: string = sortDirection === "desc" ? `-${this.sortFunc(sortVar)}` : this.sortFunc(sortVar);

    let params = qParams
      .append('from', startIdx.toString())
      .append('size', sizeLimit.toString())
      .append("sort", sortString);

    return this.myhttp.get<any[]>(`${environment.api_url}/api/${endpoint}/query`, {
      observe: 'response',
      headers: new HttpHeaders()
        .set('Accept', 'application/json'),
      params: params
    }).pipe(
      map(res => {
        // console.log(res);
        return (res["body"])
      }
      )
    );
  }


  // based on https://blog.angular-university.io/angular-material-data-table/
  // ex: https://dev.cvisb.org/api/patient/query?q=__all__&size=20&sort=cohort.keyword&sort=age&from=40
  getPaginated(endpoint, qParams, pageNum: number = 0,
    pageSize: number = 25, sortVar: string = "", sortDirection?: string): Observable<any[]> {

    // this.router.navigate(
    //   [],
    //   {
    //     relativeTo: this.route,
    //     queryParams: { q: qParams.toString() },
    //     queryParamsHandling: "merge", // remove to replace all query params by provided
    //   });

    // console.log(qParams.toString());

    // ES syntax for sorting is `sort=variable:asc` or `sort=variable:desc`
    // BUT-- Biothings changes the syntax to be `sort=+variable` or `sort=-variable`. + is optional for asc sorts
    let sortString: string = sortDirection === "desc" ? `-${this.sortFunc(sortVar)}` : this.sortFunc(sortVar);

    let params = qParams
      .append('size', pageSize.toString())
      .append('from', (pageSize * pageNum).toString())
      .append("sort", sortString);

    return this.myhttp.get<any[]>(`${environment.api_url}/api/${endpoint}/query`, {
      observe: 'response',
      headers: new HttpHeaders()
        .set('Accept', 'application/json'),
      params: params
    }).pipe(
      map(res => {
        // console.log(res);
        return (res["body"])
      }
      )
    );
  }

  // generic get function
  // assumes size = 1000 unless otherwise specified.
  get(endpoint, qParams, pageSize: number = 1000, api_url: string = environment.api_url): Observable<any[]> {

    // this.router.navigate(
    //   [],
    //   {
    //     relativeTo: this.route,
    //     queryParams: { q: qParams.toString() },
    //     queryParamsHandling: "merge", // remove to replace all query params by provided
    //   });

    let params = qParams
      .append('size', pageSize.toString());

    return this.myhttp.get<any[]>(`${api_url}/api/${endpoint}/query`, {
      observe: 'response',
      headers: new HttpHeaders()
        .set('Accept', 'application/json'),
      params: params
    }).pipe(
      map(res => {
        // console.log(res);
        return (res["body"])
      }
      )
    );
  }

  // generic get function
  // assumes size = 1000 unless otherwise specified.
  getFacetSummary(endpoint, qParams, facetString: string): Observable<any[]> {
    let params = qParams
      .append('size', 0)
      .append("facet_size", 10000)
      .append("facets", facetString);

    return this.myhttp.get<any[]>(`${environment.api_url}/api/${endpoint}/query`, {
      observe: 'response',
      headers: new HttpHeaders()
        .set('Accept', 'application/json'),
      params: params
    }).pipe(
      map(res => {
        // console.log(res);
        return (res["body"])
      }
      )
    );
  }

  // generic get function
  // assumes size = 1000 unless otherwise specified.
  getData4Patient(endpoint, patientID, pageSize: number = 1000): Observable<any[]> {

    // this.router.navigate(
    //   [],
    //   {
    //     relativeTo: this.route,
    //     queryParams: { q: qParams.toString() },
    //     queryParamsHandling: "merge", // remove to replace all query params by provided
    //   });

    let params = new HttpParams()
      .set('q', '__all__')
      .set('patientID', patientID)
      .set('size', pageSize.toString());

    return this.myhttp.get<any[]>(`${environment.api_url}/api/${endpoint}/query`, {
      observe: 'response',
      headers: new HttpHeaders()
        .set('Accept', 'application/json'),
      params: params
    }).pipe(
      map(res => {
        // console.log(res);
        return (res["body"])
      }
      )
    );
  }


  /*
    Using MyGene fetch_all to grab all the data, unscored:
    https://dev.cvisb.org/api/patient/query?q=__all__&fetch_all=true
    subsequent calls: https://dev.cvisb.org/api/patient/query?scroll_id=DnF1ZXJ5VGhlbkZldGNoCgAAAAAAANr9FlBCUkVkSkl1UUI2QzdaVlJYSjhRUHcAAAAAAADa_hZQQlJFZEpJdVFCNkM3WlZSWEo4UVB3AAAAAAAA2wUWUEJSRWRKSXVRQjZDN1pWUlhKOFFQdwAAAAAAANsGFlBCUkVkSkl1UUI2QzdaVlJYSjhRUHcAAAAAAADbABZQQlJFZEpJdVFCNkM3WlZSWEo4UVB3AAAAAAAA2v8WUEJSRWRKSXVRQjZDN1pWUlhKOFFQdwAAAAAAANsBFlBCUkVkSkl1UUI2QzdaVlJYSjhRUHcAAAAAAADbAhZQQlJFZEpJdVFCNkM3WlZSWEo4UVB3AAAAAAAA2wMWUEJSRWRKSXVRQjZDN1pWUlhKOFFQdwAAAAAAANsEFlBCUkVkSkl1UUI2QzdaVlJYSjhRUHc=
    If no more results to be found, "success": false

    Adapted from https://stackoverflow.com/questions/44097231/rxjs-while-loop-for-pagination

    NOTE: 2019-10-04 Seems to create some problems when fetchAll is called simultaneously on server-side and client-side
    Some sort of weird cache shared settings?

    *Original problem*: calling `getDataset` from `get-datasets.service` in `get-datasets.resolver` makes three API calls: one get to `/dataset`,
    one fetchAll to `/datadownload` and one fetchAll to `/experiment`. Also triggered by calling `fetchAll` in constructor of `get-datasets.resolver`.

    *Behavior*: in at least one of the client- or server-side of things, will lead to an infinite loop of API calls
    when there are more than 1000 results. `_scroll_id` never turns into null, and will lead to an error:
    `RangeError: Maximum call stack size exceeded`. Seems to be an issue where both client-side and server-side
    have the same `_scroll_id`, leading to conflicts where they never seem to exit the fetch next behavior.
    But... not totally clear, since

    *Solution*:
    * 1) have the API call execute only *once* (server-side) à la :
    *    https://blog.angularindepth.com/using-transferstate-api-in-an-angular-5-universal-app-130f3ada9e5b
    *    (which is good anyway, since it eliminates redundant calls)
    * 2) transfer the state (data from server-side call to API, in `get-datasets.resolver`)
    * 3) set `concurrent` = 1 and added `queueScheduler` to `expand`, as suggested in the comments:
    *    https://blog.angularindepth.com/rxjs-understanding-expand-a5f8b41a3602
    *    Note: seems like this shouldn't be necessary, but it'll definitely lead to an infinite state
    *    on the server-side, which doesn't resolve; therefore within the resolver, client-side gets called
    *    as well, and it ends up being a big ole mess. Setting `concurrent=1` isn't sufficient to fix the problem.

    *    UPDATE 2019-12-06: still having problems. With fetchAll call to /experiment where there is more than one page of results,
    *    the data returned ends up being the initial results, and then the second page of results either repeated 2x (with `expand params (.., 1, queueScheduler)`)
    *    or infinitely till the browser poops out (with no additional `expand` params).
    *
    *   What seems to be the problem is that Angular is caching the results of the http call and will return that ad infinitim.
    *   It sees https://dev.cvisb.org/api/experiment/query?q=__all__&fetch_all=true&scroll_id=<SCROLLID> as being the same... so returns the results.
    *   `scroll_id` is always the same and always exists, so the expand recursive loop never ends.  Issue with the headers:
    *   key: "cache-control" value: ["max-age=604800, public"]
    *
    *   FIX: a bit of a hack, but adding in a `pageNum` parameter to the http call to trick Angular into thinking it's a new call.
    *   This param will be ignored by Biothings, so it passes the same query, but Angular will recognize it as a new call and trigger a request.
    *   Decided to deal with it this way rather than changing the caching, since caching can be useful, of course.
    */

  fetchAll(endpoint: string, qParams: HttpParams): Observable<any[]> {
    return this.fetchOne(endpoint, qParams, 0).pipe(
      expand((data, _) => data.next ? this.fetchOne(endpoint, qParams, data.counter, data.next) : EMPTY),
      pluck("results"),
      reduce((acc, data: any) => {
        return acc.concat(data);
      }, []),
      catchError(e => {
        console.log(e)
        throwError(e);
        return (of(e))
      }),
      map((all_data) => {
        // last iteration returns undefined; filter out
        all_data = all_data.filter(d => d);

        return (all_data);
      })
    )
  }

  fetchOne(endpoint: string, qParams: HttpParams, counter: number, scrollID?: string): Observable<{ next: string | null, results: any[], counter: number }> {
    let params = qParams
      .append('fetch_all', "true")
      .append('pageNum', String(counter)); // dummy parameter; added 2019-12-06 to trigger HttpClient to make a new API call to fetch the next results.

    if (scrollID) {
      params = params.append('scroll_id', scrollID);
    }

    return this.get(endpoint, params).pipe(
      map(response => {

        return {
          next: response['_scroll_id'],
          results: response['hits'],
          counter: counter + 1
        };
      }),
      catchError(e => {
        console.log(e)
        throwError(e);
        return (new Observable<any>())
      })
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
  //
  // putRecursive(endpoint: string, newData: any, idx: number = 0) {
  //   return this.put(endpoint, newData)
  //     .map((response) => {
  //       console.log("put response")
  //       console.log(response)
  //       return ({ data: response; index: idx += 1 });
  //     }, err =>{
  //       console.log(err)
  //     })
  // }


  put(endpoint: string, newData: any): Observable<any> {
    // console.log("putting")
    if (newData) {
      // console.log('adding new data')
      return this.myhttp.put<any[]>(`${environment.api_url}/api/${endpoint}`,
        this.jsonify(newData),
        {
          headers: new HttpHeaders()
        });
    } else {
      console.log('no data to add')
    }
  }


  // Generic PUT function, done in `size` pieces.
  // Executed in a cascade, where the previous API completes before
  // Modified from https://stackoverflow.com/questions/41619312/send-multiple-asynchronous-http-get-requests/41620361#41620361
  putPiecewise(endpoint: string, newData: any, size: number = 25): Observable<any> {
    console.log("PUT REQUEST")

    const tagError = tag => catchError(error => {
      error.tag = tag;
      throw error;
    });

    let numChunks = Math.ceil(newData.length / size);
    let pct_done = 0;

    let results = [];
    let miniDatasets = [];

    for (let i = 0; i < numChunks; i++) {
      miniDatasets.push(newData.slice(i * size, (i + 1) * size));
    }

    return miniDatasets.reduce((acc, curr) => acc.pipe(
      mergeMap(_ => this.put(endpoint, curr)
        .pipe(
          map(single => {
            return (single);
          }),
          catchError(e => {
            return of(e);
          }),
      )
      ),
      tap(value => {
        // console.log(value)
        pct_done = pct_done + (curr.length / newData.length) * 100;
        this.uploadProgressSubject.next(pct_done);
        results.push(value);
      }),
      reduce((a, i) => {
        // return the saved results
        return (results)
      }, []),
    ), of(undefined));

    // WORKS BUT NOT SEQUENTIAL.
    // let singleObservables = from(miniDatasets).pipe(
    //   mergeMap((data: any[]) => {
    //     return this.put(endpoint, data)
    //       .pipe(
    //         map(single => {
    //           pct_done = pct_done + (data.length / newData.length) * 100;
    //           this.uploadProgressSubject.next(pct_done);
    //           console.log(pct_done)
    //           return (single);
    //         }),
    //         catchError(e => {
    //           pct_done = pct_done + (data.length / newData.length) * 100;
    //           this.uploadProgressSubject.next(pct_done);
    //           return of(e);
    //         })
    //       )
    //   }),
    //    reduce((a, i) => [...a, i], []),
    // );
    //
    // console.log(singleObservables)
    //
    // return (singleObservables);

    // CHUNKIFIED BUT SYNCHRONOUS CALLS TO BACKEND
    // let singleObservables = miniDatasets.map((data: any[]) => {
    //   return this.put(endpoint, data)
    //     .pipe(
    //       map(single => {
    //         pct_done = pct_done + (data.length / newData.length) * 100;
    //         this.uploadProgressSubject.next(pct_done);
    //         return (single);
    //       }),
    //       catchError(e => {
    //         pct_done = pct_done + (data.length / newData.length) * 100;
    //         this.uploadProgressSubject.next(pct_done);
    //         return of(e);
    //       })
    //     )
    // });
    //
    // return (of(results));
  }

  // Function to look up IDs and replace
  prepPatientUpload(endpoint: string, uniqueID: string, data: Object[]): Observable<any> {
    this.loadingSubject.next(true)
    console.log("PREP UPLOAD")
    const ids = `"${data.map(d => d[uniqueID]).join('","')}"`;
    const qParams = new HttpParams()
      .set("q", "__all__")
      .set("patientID", ids)
      .set("fields", "alternateIdentifier")

    return (this.fetchAll(endpoint, qParams).pipe(
      map(ids => {
        let duplicateIDs = [];
        data.forEach(d => {
          let filtered = ids.filter(id => id.alternateIdentifier.includes(d[uniqueID]));
          if (filtered.length) {
            d["_id"] = filtered[0]["_id"];
          }

          if (filtered.length > 1) {
            duplicateIDs.push(d[uniqueID])
          }
        })

        return (duplicateIDs)
      }),
      finalize(() => this.loadingSubject.next(false))
    ))
  }

  prepUpload(endpoint: string, uniqueID: string, data: Object[]): Observable<any> {
    this.loadingSubject.next(true)
    console.log("PREP UPLOAD")
    const ids = `"${data.map(d => d[uniqueID]).join('","')}"`;
    const qParams = new HttpParams()
      .set("q", `${uniqueID}:${ids}`)
      .set("fields", uniqueID)

    return (this.fetchAll(endpoint, qParams).pipe(
      map(ids => {
        let duplicateIDs = [];
        data.forEach(uploadRecord => {
          let filtered = ids.filter(id => id[uniqueID] == uploadRecord[uniqueID]);
          if (filtered.length) {
            uploadRecord["_id"] = filtered[0]["_id"];
          }

          if (filtered.length > 1) {
            duplicateIDs.push(uploadRecord[uniqueID])
          }
        })

        return (duplicateIDs)
      }),
      finalize(() => this.loadingSubject.next(false))
    ))
  }

  // Function to convert to a json object to be inserted by ES
  jsonify(arr: any[]): string {
    let json_arr = [];

    for (let record of arr) {
      json_arr.push(JSON.stringify(record))
    }
    return (json_arr.join("\n"))
  }

  tidyPutResponse(responses, dataLength, dataType) {
    let errs = responses.filter(d => !d.success);
    let uploaded = responses.filter(d => d.success);
    let updatedCount = uploaded.length > 0 ? uploaded.map(d => +d.message.split(" ")[0]).reduce((total, num) => total + num) : 0;
    let uploadResponse: string;
    let errorMsg: string;
    let errorObj: Object[];

    if (errs.length > 0) {
      uploadResponse = `Uh oh. Something went wrong. ${updatedCount} ${dataType} updated; ${dataLength - updatedCount} failed.`
      let msgArray = errs.filter(d => d.error.error).map(d => d.error.error);
      errorMsg = msgArray.length > 0 ? msgArray.join("; ") : "Dunno why-- are you logged in? Check the developer console. Sorry :("

      errorObj = flattenDeep(errs.filter(d => d.error.error_list).map(d => d.error.error_list));
      //
      if (errorObj.length > 0) {
        errorObj = this.tidyBackendErrors(errorObj)
      }
    } else {
      uploadResponse = `Success! ${updatedCount} ${dataType} added or updated`;
    }

    return ({ uploadResponse: uploadResponse, errorMsg: errorMsg, errorObj: errorObj })
  }


  tidyBackendErrors(error_array) {
    let errs = [];

    // Reformat the errors
    error_array.forEach(document => document.error_messages.forEach(
      msg => errs.push({
        message: msg.split("\n").filter((d, i) => i === 0 || i === 2),
        id: document.input_obj.patientID,
        input: document.input_obj
      })))
    console.log(errs)

    // Group by error type
    let nested = nest()
      .key((d: any) => d.message)
      .rollup(function(values: any): any {
        return {
          count: values.length,
          ids: values.map(x => x.id),
          inputs: values.map(x => x.input)
        }
      }).entries(errs);

    console.log(nested)

    return (nested)
  }


  // --- DELETE ---
  // Generic function to delete a single record.
  deleteObject(endpoint: string, id: string, api_url: string = environment.api_url) {
    console.log("attempting to delete obj: " + id)
    // TODO: build-in dialoge box to confirm?
    this.myhttp.delete(`${api_url}/api/${endpoint}/${id}`)
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


  // Removes fields from each object in an array of objects.
  dropCols(data, cols, copy = true) {
    let filtered;
    if (copy) {
      filtered = cloneDeep(data)
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

  // generic sorting function to reorder an array by another array
  sortByArray(arr: string[], sortOrderArr: string[]): string[] {
    let sortingFunc = function(a, sortOrderArr) {
      let idx = sortOrderArr.indexOf(a);
      // if not found, return dummy so sorts at the end
      if (idx < 0) {
        return (1000);
      }
      return (idx);
    }

    return (arr.sort((a, b) => sortingFunc(a, sortOrderArr) - sortingFunc(b, sortOrderArr)))
  }
}
