import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class FeedbackDialogService {

  constructor(private http:HttpClient) { }

  saveCustomerFeedBack(data:any): Observable<any> {
    const url = `${environment.hostName}/feedback`;
    return this.http.post<any>(url,data);
  }
}
