import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(private http: HttpClient) { }

  createOrder(amount: number): Observable<any> {
    const url = `${environment.hostName}/payment/create_order`;
    const header = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const httpOptions = { headers: header };
    return this.http.post<any>(url, {amount}, httpOptions);
  }

  capturePayment(paymentInfo: Object): Observable<any> {
    const url = `${environment.hostName}/payment/capture_payment`;
    const header = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const httpOptions = { headers: header };
    return this.http.post<any>(url, paymentInfo, httpOptions);
  }
}
