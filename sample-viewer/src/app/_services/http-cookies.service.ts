// Function to embed cookies in http request.
// Since Authentication calls to `/user` require the local cookie, need to embed the cookie in the server-side rendering of the initial call to each page.
// Secondly-- for every initial server-side request to get data from the backend, the HttpClient also needs to have the authentication cookie passed back to the server to properly authenticate.
// Modified from https://github.com/angular/universal-starter/issues/373#issuecomment-366254611
// Injector Request error (`ERROR Error: No provider for InjectionToken REQUEST!`) solved via https://github.com/angular/universal/issues/709#issuecomment-429083563

import { Injectable, Inject, PLATFORM_ID, Injector, Optional } from "@angular/core";
import { isPlatformServer } from '@angular/common';
import { HttpClient, HttpHeaders, HttpParams, HttpRequest, HttpHandler } from "@angular/common/http";
import { Observable } from 'rxjs';

import { REQUEST } from '@nguniversal/express-engine/tokens';


interface IHttpOptions {
  body?: any;
  headers?: HttpHeaders | {
    [header: string]: string | string[];
  };
  params?: HttpParams | { [param: string]: string | number | boolean | readonly (string | number | boolean)[];
  };
  reportProgress?: boolean;
  responseType?: 'arraybuffer' | 'blob' | 'json' | 'text';
  withCredentials?: boolean;
}

@Injectable()
export class MyHttpClient extends HttpClient {

  constructor(
    handler: HttpHandler,
    private injector: Injector,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Optional() @Inject(REQUEST) private req: any
  ) {
    super(handler);
  }

  // `first` is either method or httprequest
  // overwrites `request()` from `HttpClient`
  // Http caching intercepted according to https://stackoverflow.com/questions/37755782/prevent-ie11-caching-get-call-in-angular-2
  // Without this, backend/front-end are out of sync if the backend changes during client session.
  request(first: string | HttpRequest<any>, url?: string, options: IHttpOptions = {}): Observable<any> {
    // ensures headers properties are not null
    if (!options)
      options = {};
    if (!options.headers) {
      options.headers = new HttpHeaders()
        .set('Cache-Control', 'no-cache')
        .set("Access-Control-Allow-Origin", '*')
        .set('Pragma', 'no-cache')
        .set("Set-Cookie", "HttpOnly;Secure;SameSite=Strict")
        .set('Expires', 'Sat, 01 Jan 2000 00:00:00 GMT')
        .set('If-Modified-Since', '0');
    }
    else {
      options.headers = <HttpHeaders>options.headers;
      options.headers = options.headers
      .append('Cache-Control', 'no-cache')
        .append('Pragma', 'no-cache')
        .set("Access-Control-Allow-Origin", '*')
        .append("Set-Cookie", "HttpOnly;Secure;SameSite=Strict")
        .append('Expires', 'Sat, 01 Jan 2000 00:00:00 GMT')
        .append('If-Modified-Since', '0')
    }

    if (typeof first !== "string" && !first.headers)
      first = (first as HttpRequest<any>).clone({ headers: new HttpHeaders() });

    // xhr withCredentials flag
    if (typeof first !== "string")
      first = (first as HttpRequest<any>).clone({
        // withCredentials needs to be true to allow cookie to be passed to the client
        // ... but to get it to run on localhost (with only public data from the API), it needs to be false to allow CORS
        withCredentials: true,
      });
    options.withCredentials = true;

    // if we are server side, then import cookie header from express
    if (isPlatformServer(this.platformId)) {
      // const req: any = this.injector.get('REQUEST'); --> StaticInjectorError.  Replaced by import of REQUEST
      const rawCookies = !!this.req.headers['cookie'] ? this.req.headers['cookie'] : '';

      if (typeof first !== "string")
        first = (first as HttpRequest<any>).clone({ setHeaders: { 'cookie': rawCookies } });
      options.headers = (options.headers as HttpHeaders).set('cookie', rawCookies);
    }

    return super.request(first as (any), url, options);
  }

}
