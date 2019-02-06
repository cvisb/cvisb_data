// Copied from https://github.com/angular/universal-starter/issues/373#issuecomment-366254611

import { Injectable, Inject, PLATFORM_ID, Injector, Optional } from "@angular/core";
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { HttpClient, HttpHeaders, HttpParams, HttpRequest, HttpHandler } from "@angular/common/http";
import { Observable } from 'rxjs';

import { REQUEST } from '@nguniversal/express-engine/tokens';


interface IHttpOptions {
  body?: any;
  headers?: HttpHeaders | {
    [header: string]: string | string[];
  };
  params?: HttpParams | {
    [param: string]: string | string[];
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
  request(first: string | HttpRequest<any>, url?: string, options: IHttpOptions = {}): Observable<any> {
    // ensures headers properties are not null
    if (!options)
      options = {};
    if (!options.headers)
      options.headers = new HttpHeaders();
    if (typeof first !== "string" && !first.headers)
      first = (first as HttpRequest<any>).clone({ headers: new HttpHeaders() });

    // xhr withCredentials flag
    if (typeof first !== "string")
      first = (first as HttpRequest<any>).clone({
        withCredentials: true,
      });
    options.withCredentials = true;

    // if we are server side, then import cookie header from express
    if (isPlatformServer(this.platformId)) {
      // console.log(this.injector)
      // const req: any = this.injector.get('REQUEST');
      const rawCookies = !!this.req.headers['cookie'] ? this.req.headers['cookie'] : '';

      console.log(this.req.headers)
      console.log(rawCookies)
      // console.log(first)
      // console.log(url)


      if (typeof first !== "string")
        first = (first as HttpRequest<any>).clone({ setHeaders: { 'cookie': rawCookies } });
      options.headers = (options.headers as HttpHeaders).set('cookie', rawCookies);
    }
    console.log(options)
    // return null

    return super.request(first as (any), url, options);
  }

}
