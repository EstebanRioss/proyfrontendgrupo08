// src/app/services/payment.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private backendUrl = 'http://localhost:3000/api/mp'; 

  constructor(private http: HttpClient) { }

  createPreference(orderData: any): Observable<any> {
    return this.http.post(`${this.backendUrl}/buy-ticket`, orderData);
  }
}