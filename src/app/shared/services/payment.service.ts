import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private pricesCache: Observable<any> | null = null;

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

  getPrices(): Observable<any> {
    if (!this.pricesCache) {
      const url = `${environment.hostName}/pricing/get_prices`;
      this.pricesCache = this.http.get<any>(url).pipe(
        shareReplay(1), // Cache the last emitted value
      );
    }
  
    return this.pricesCache;
  }

  getUserPaymentHistory(){
    const url =  `${environment.hostName}/payment/payment-history`;

    return this.http.get<any>(url);
  }
}
