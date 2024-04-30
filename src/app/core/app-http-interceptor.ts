import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';

import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, finalize, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { CommonService } from '../shared/services/common.service';


const TOKEN_HEADER_KEY = 'Authorization';

@Injectable()
export class AppHttpInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService,
    private commonService: CommonService
  ) {
    console.log('intercept constructor');
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<Object>> {
    console.log("intercept");
    let authReq = request;
    const token = this.authService.token;
    if (token != '') {
      authReq = this.addTokenHeader(request, token);
    }

    return next.handle(authReq).pipe(
      catchError((error) => this.handleError(error, authReq, next)));

  }

  private addTokenHeader(request: HttpRequest<any>, token: string) {
    /* for Spring Boot back-end */
    return request.clone({
      headers: request.headers.set(TOKEN_HEADER_KEY, `Bearer ${token}`),
    });
  }

  private handleError(
    err: HttpErrorResponse,
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<any> {
    // if token has expired / unauthorized access
    if (err.status == 401) {
      console.log("Logged in state : ", this.authService.isLoggedIn);
      if (this.authService.isLoggedIn) {
        this.authService.logout();
        this.commonService.showSnackbar('snackbar-error', 'Token expired, please login again !', 'ERR005');
        return throwError(() => err);
      } else {
        this.commonService.showSnackbar('snackbar-error', 'You need to login to perform the action !', 'ERR006');
        // this.commonService.openLoginModal();
        return throwError(() => err);
      }
    }
    // server error
    else if (err.status == 500) {
      //  handle your server error here
    }
    // rethrow Error
    return throwError(() => err);
  }
}
