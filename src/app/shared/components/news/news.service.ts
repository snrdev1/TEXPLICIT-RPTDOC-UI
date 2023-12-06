import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  constructor(private http: HttpClient) {}
  
  getNews(query: string, engine: number, count: number, start: number, randomId: string): Observable<any> {
    const url = `${environment.hostName}/get-news`;
    const params = {
      "query": query,
      "engine": engine,
      "count": count,
      "start": start,
      "randomId": randomId
    };
    return this.http.get<any>(url, {params});
  }

  shareNews(newsData: any, folder: any){
    const url = `${environment.hostName}/news-document`;
    const params = {
      "news": newsData,
      "folder": folder
    }
    return this.http.post<any>(url, params);
  }
}
