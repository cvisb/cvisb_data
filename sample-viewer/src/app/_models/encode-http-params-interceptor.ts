// Customized interceptor for HTTP params
// Used for passing & in parameters to backend, a la:
// https://dev.cvisb.org/api/patient/query?q=__all__&size=0&facet_size=10000&sampleQuery=*&facets=alternateIdentifier.keyword(cohort.keyword)
// sampleQuery typically gets translated, where & turns into %26, which doesn't work.
// Based on https://stackoverflow.com/questions/45428842/angular-url-plus-sign-converting-to-space/52458069#52458069
// and https://medium.com/@er.surajnegi/what-are-angular-http-interceptors-and-how-to-create-them-82d1d6159c4e

import { HttpInterceptor, HttpRequest, HttpEvent, HttpHandler, HttpParams, HttpParameterCodec } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable()
export class EncodeHttpParamsInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const params = new HttpParams({encoder: new CustomEncoder(), fromString: req.params.toString()});
    return next.handle(req.clone({params}));
  }
}


class CustomEncoder implements HttpParameterCodec {
  encodeKey(key: string): string {
    return encodeURIComponent(key);
  }

  encodeValue(value: string): string {
    return value;
    // return encodeURIComponent(value);
  }

  decodeKey(key: string): string {
    return decodeURIComponent(key);
  }

  decodeValue(value: string): string {
    return decodeURIComponent(value);
  }
}
