import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DeliveryRequest } from '../shared/model/delivrey-request';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiUrl = 'http://localhost:3000/deliveryRequests';

  private http = inject(HttpClient);

  sendOrder(order: DeliveryRequest): Observable<DeliveryRequest> {
    return this.http.post<DeliveryRequest>(this.apiUrl, order);
  }
  getOrders(): Observable<DeliveryRequest[]> {
    return this.http.get<DeliveryRequest[]>(this.apiUrl);
  }
}
