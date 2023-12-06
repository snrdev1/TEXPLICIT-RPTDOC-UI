import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor( private http: HttpClient) { }

  getChatResponses(prompt: string, chatType: number): Observable<any>{
    const url = `${environment.hostName}/chat`;
    const params = {"prompt": prompt, "chatType": chatType};
    return this.http.post<any>(url,{params});
  }

  getChatHistory(): Observable<any>{
    const url = `${environment.hostName}/chat`;
    return this.http.get<any>(url);
  }
}
