import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { Products } from '../shared/model/product';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {
  private apiUrl = 'http://localhost:3000/favorites';
  private favoritesSubject = new BehaviorSubject<Products[]>([]);
  favorites$ = this.favoritesSubject.asObservable();

  private http = inject(HttpClient);

  constructor() {
    this.loadFavorites();
  }

  loadFavorites() {
    this.http.get<Products[]>(this.apiUrl).subscribe((favorites) => {
      this.favoritesSubject.next(favorites);
    });
  }

  addToFavorites(product: Products) {
    return this.http
      .post<Products>(this.apiUrl, product)
      .pipe(tap(() => this.loadFavorites()))
      .subscribe();
  }

  removeFromFavorites(productId: number) {
    return this.http
      .delete(`${this.apiUrl}/${productId}`)
      .pipe(tap(() => this.loadFavorites()))
      .subscribe();
  }

  toggleFavorite(product: Products) {
    if (this.isFavorite(product.id)) {
      this.removeFromFavorites(product.id);
    } else {
      this.addToFavorites(product);
    }
  }

  isFavorite(productId: number): boolean {
    const favorites = this.favoritesSubject.value;
    return favorites.some((p) => p.id === productId);
  }

  getFavorites() {
    return this.favoritesSubject.value;
  }

  clearFavorites() {
    this.favoritesSubject.value.forEach((p) => this.removeFromFavorites(p.id));
  }

  private currentProductSubject = new BehaviorSubject<Products | null>(null);
  currentProduct$ = this.currentProductSubject.asObservable();

  openModal(product: Products) {
    this.currentProductSubject.next(product);
  }
}
