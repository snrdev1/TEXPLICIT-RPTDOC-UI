import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { environment } from 'src/environments/environment.development';
@Injectable({
  providedIn: 'root'
})
export class RegistrationService {

  constructor(private http: HttpClient) {}

    addUser(user : any): Observable<any>{
      const url = `${environment.hostName}/account/signup`;
      const header = new HttpHeaders({
        'Content-Type':'application/json'
      });
      const httpOptions = { headers: header};
      return this.http.post<any>(url, user, httpOptions);
    }
   }

