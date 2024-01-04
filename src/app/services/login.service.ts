import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) {}
    login(user:any): Observable<any>{
      const url = `${environment.hostName}/account/login`;
      return this.http.post<any>(url,user);
    }
}
