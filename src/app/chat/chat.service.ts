import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private http: HttpClient) { }

  getChatResponses(prompt: string, chatType: number, chatId: string): Observable<any> {
    const url = `${environment.hostName}/chat`;
    const params = { "prompt": prompt, "chatType": chatType, "chatId": chatId };
    return this.http.post<any>(url, params);
  }

  getChatHistory(limit: number = 10, offset: number = 0): Observable<any> {
    const url = `${environment.hostName}/chat`;
    const params = { "limit": limit, "offset": offset };
    return this.http.get<any>(url, { params });
  }

  deleteChat(): Observable<any> {
    const url = `${environment.hostName}/chat`;
    return this.http.delete<any>(url);
  }
}
