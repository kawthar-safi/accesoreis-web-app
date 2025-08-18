import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Products } from '../shared/model/product';
import { Fav } from '../shared/model/fav';

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {
  private favorites: Fav[] = [];
  private favoritesSubject = new BehaviorSubject<Fav[]>([]);

  favorites$ = this.favoritesSubject.asObservable();

  addToFavorites(product: Products) {
    if (!this.favorites.find((p) => p.id === product.id)) {
      this.favorites.push(product);
      this.favoritesSubject.next(this.favorites);
    }
  }

  removeFromFavorites(productId: number) {
    this.favorites = this.favorites.filter((p) => p.id !== productId);
    this.favoritesSubject.next(this.favorites);
  }

  getFavorites() {
    return this.favorites;
  }

  clearFavorites() {
    this.favorites = [];
    this.favoritesSubject.next(this.favorites);
  }
}
