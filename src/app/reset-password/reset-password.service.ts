import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class ResetPasswordService {

  constructor( private http : HttpClient) { }

  sendPasswordResetEmail(emailParam: any): Observable<any>{
    const url = `${environment.hostName}/account/reset-password/generatetoken`;
    return this.http.post<any>(url, emailParam);
  }

  checkTokenValidity(token: string = ""): Observable<any> {
    const url = `${environment.hostName}/account/reset-password/verify-token/${token}`;
    return this.http.get<any>(url);
  }

  updatePassword(token: string = "", newPassword: string = ""): Observable<any> {
    const url = `${environment.hostName}/account/reset-password/update-password`;
    let params = {
      "token": token,
      "newPassword": newPassword
    };
    return this.http.post<any>(url, params);
  }
}
