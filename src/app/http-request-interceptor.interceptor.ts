import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { LoadingService } from './loading.service';

/**
 * This class is for intercepting http requests. When a request starts, we set the loadingSub property
 * in the LoadingService to true. Once the request completes and we have a response, set the loadingSub
 * property to false. If an error occurs while servicing the request, set the loadingSub property to false.
 * @class {HttpRequestInterceptor}
 */

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {
  constructor(private _loading: LoadingService) {}

  // intercept(
  //   request: HttpRequest<unknown>,
  //   next: HttpHandler
  // ): Observable<HttpEvent<unknown>> {
  //   console.log('intercepted request ... ');
  //   return next.handle(request);
  // }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    this._loading.setLoading(true, request.url);
    return next.handle(request).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          this._loading.setLoading(false, request.url);
        }
        console.log('event is:', event);
        return event;
      }),
      catchError((error) => {
        this._loading.setLoading(false, request.url);
        throw error;
      })
    );
  }
}
