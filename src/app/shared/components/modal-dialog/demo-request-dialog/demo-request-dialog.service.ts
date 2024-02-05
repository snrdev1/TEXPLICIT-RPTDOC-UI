import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DemoRequestDialogService {

  constructor(private http: HttpClient) { }

  requestDemo(data: any): Observable<any> {
    const url = `${environment.hostName}/demo`;
    return this.http.post<any>(url, data);
  }
}
