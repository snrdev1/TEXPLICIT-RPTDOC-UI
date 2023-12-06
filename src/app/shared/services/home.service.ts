import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  fileExtension = '.xlsx';
  constructor( private http: HttpClient) { }

  getUserDomains(): Observable<any> {
    const url = `${environment.hostName}/account/domains`;
    return this.http.get<any>(url);
  }
  getKisByDomain(domainId: string, tags: any = [], query: string = '', offset: number, limit: number): Observable<any> {
    const url = `${environment.hostName}/ki/domain/all`;
    const param = {
      "domainId": domainId,
      "tags": tags,
      "query": query,
      "kiOffset": offset,
      "kiLimit": limit
    };
    return this.http.post<any>(url, param);
  }

  getKiDetails(ki_id: string): Observable<any>{
    const url = `${environment.hostName}/ki/${ki_id}`;
    return this.http.get<any>(url);
  }

  getAllTags(): Observable<any>{
    const url = `${environment.hostName}/ki/tags`;
    return this.http.get<any>(url);
  }

  getItemizedSummary(ki_ids: string[]): Observable<any>{
    const url = `${environment.hostName}/summary/itemized`;
    const params = {
      kiIds: ki_ids
    }
    return this.http.post<any>(url,params);
  }

  getHighlights(ki_ids: string[]): Observable<any>{
    const url = `${environment.hostName}/summary/highlights`;
    const params = {
      kiIds: ki_ids
    }
    return this.http.post<any>(url,params);
  }

  getConsolidatedSummary(ki_ids: string[]): Observable<any>{
    const url = `${environment.hostName}/summary/consolidated`;
    const params = {
      kiIds: ki_ids
    }
    return this.http.post<any>(url,params);
  }

  downloadItemizedExcel(data: any): Observable<Blob> {
    const url = `${environment.hostName}/summary/itemized/downloadexcel`;
    return this.http.post(url, data, { responseType: 'blob' });
  }

  downloadItemizedDoc(data: any): Observable<Blob> {
    const url = `${environment.hostName}/summary/itemized/downloaddocx`;
    return this.http.post(url, data, { responseType: 'blob' });
  }

  downloadItemizedPowerpoint(data: any): Observable<Blob> {
    const url = `${environment.hostName}/summary/itemized/downloadppt`;
    return this.http.post(url, data, { responseType: 'blob' });
  }

  downloadHighlightsExcel(data:any): Observable<Blob>{
    const url = `${environment.hostName}/summary/highlights/downloadexcel`;
    return this.http.post(url,data,{responseType:'blob'});
  }
  downloadHighlightsDoc(data:any): Observable<Blob>{
    const url = `${environment.hostName}/summary/highlights/downloaddocx`;
    return this.http.post(url,data,{responseType:'blob'});
  }
  downloadHighlightsPowerpoint(data:any): Observable<Blob>{
    const url = `${environment.hostName}/summary/highlights/downloadppt`;
    return this.http.post(url,data,{responseType:'blob'});
  }
  downloadConsolidatedPowerpoint(data:any): Observable<Blob>{
    const url = `${environment.hostName}/summary/consolidated/downloadppt`;
    return this.http.post(url,data,{responseType:'blob'});
  }
  downloadConsolidatedExcel(data: any): Observable<Blob>{
    const url = `${environment.hostName}/summary/consolidated/downloadexcel`;
    return this.http.post(url, data, {responseType: 'blob'});
  }

  downloadConsolidatedDoc(data: any): Observable<Blob>{
    const url = `${environment.hostName}/summary/consolidated/downloaddocx`;
    return this.http.post(url, data, {responseType: 'blob'});
  }
  
  myTexplicitKiToggle(ki_id: string): Observable<any>{
    const url = `${environment.hostName}/mytexplicit/toggle`;
    const params = {
      "ki_id":ki_id
    }
    return this.http.post<any>(url, params);
    }

    
  }


