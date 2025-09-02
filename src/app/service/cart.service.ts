import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartItem } from '../shared/model/product';
const CART_KEY = 'cart';
@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartItems = new BehaviorSubject<CartItem[]>(this.loadCart());
  cartItems$ = this.cartItems.asObservable();

  private cartCount = new BehaviorSubject<number>(
    this.calculateTotalCount(this.loadCart())
  );
  cartCount$ = this.cartCount.asObservable();

  private loadCart(): CartItem[] {
    if (
      typeof window !== 'undefined' &&
      typeof window.localStorage !== 'undefined'
    ) {
      const stored = localStorage.getItem(CART_KEY);
      return stored ? JSON.parse(stored) : [];
    }

    return [];
  }

  private saveCart(items: CartItem[]) {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
    this.cartItems.next(items);
    this.cartCount.next(this.calculateTotalCount(items));
  }

  private calculateTotalCount(items: CartItem[]): number {
    return items.reduce((sum, item) => sum + (item.quantity || 1), 0);
  }

  addToCart(item: CartItem) {
    const current = this.cartItems.value;
    const index = current.findIndex((i) => i.id === item.id);

    if (index > -1) {
      current[index].quantity += item.quantity || 1;
    } else {
      current.push({
        ...item,
        quantity: item.quantity || 1,
      });
    }

    this.cartItems.next(current);
    this.cartCount.next(this.calculateTotalCount(current));

    localStorage.setItem(CART_KEY, JSON.stringify(current));
  }

  removeFromCart(productId: number) {
    let cart = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
    cart = cart.filter((item: CartItem) => item.id !== productId);
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    this.updateCartItems(cart);
    this.updateCartCountFromStorage();
  }

  clearCart() {
    localStorage.removeItem(CART_KEY);
    this.cartItems.next([]);
    this.cartCount.next(0);
  }

  getCurrentItems(): CartItem[] {
    return this.cartItems.value;
  }

  updateItemQuantity(itemId: number, quantity: number) {
    const current = this.loadCart();
    const index = current.findIndex((item) => item.id === itemId);
    if (index !== -1) {
      current[index].quantity = quantity;
      this.saveCart(current);
    }
  }
  private updateCartItems(items: CartItem[]) {
    this.cartItems.next(items);
  }

  private updateCartCountFromStorage() {
    const items = this.loadCart();
    this.cartCount.next(this.calculateTotalCount(items));
  }
}
