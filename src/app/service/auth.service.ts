import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  // getCustomers(id: string): Observable<Customer> {
  //   return this.http.get<Customer>(`${this.customersUrl}/${id}`);
  // }

  // updateCustomer(id: string, data: Customer): Observable<Customer> {
  //   return this.http.put<Customer>(`${this.customersUrl}/${id}`, data);
  // }

  // getAllCustomers(): Observable<Customer[]> {
  //   return this.http.get<Customer[]>(this.customersUrl);
  // }
}
