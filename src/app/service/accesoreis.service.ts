import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Products } from '../shared/model/product';

@Injectable({
  providedIn: 'root',
})
export class AccesoreisService {
  private apiUrl = 'http://localhost:3000/accesoreis';
  http = inject(HttpClient);
  getAccesoreis(): Observable<Products[]> {
    return this.http.get<Products[]>(this.apiUrl);
  }
}
