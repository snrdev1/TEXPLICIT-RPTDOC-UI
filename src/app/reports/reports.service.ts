import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  constructor(private http:HttpClient) { }

  generateReport(topic: any): Observable<any>{
    const url = `${environment.hostName}/report/generate`;
    return this.http.post<any>(url,topic);
  }
  getAllreports(limit:number, offset:number,source:string,format:string,report_type:string): Observable<any>{
    const url = `${environment.hostName}/report/all`;
    const params = {
      "limit":limit,
      "offset":offset,
      "source":source,
      "format":format,
      "report_type": report_type
    }
    return this.http.get<any>(url,{params});
  }
  downloadReportsDoc(virtualFileName: string): Observable<Blob> {
    const url = `${environment.hostName}/report/download/${virtualFileName}`;
    return this.http.get(url, { responseType: 'blob' });
  }
  deleteReport(params: any): Observable<any> {
    const url = `${environment.hostName}/report`;
    const options = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      body: params,
    };
    return this.http.delete<any>(url, options);
  }
  downloadReportAudio(reportId: string): Observable<Blob> {
    const url = `${environment.hostName}/report/audio/download/${reportId}`;
    return this.http.get(url, { responseType: 'blob' });
  }
}
