import { Component, inject, OnInit } from '@angular/core';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CartItem } from '../../shared/model/product';
import { CartService } from '../../service/cart.service';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';

import { OrderService } from '../../service/order.service';
import {
  DeliveryRequest,
  PaymentStatus,
} from '../../shared/model/delivrey-request';
import { Customer } from '../../shared/model/customer';

@Component({
  selector: 'app-cart',
  imports: [CommonModule, FormsModule, TranslatePipe],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  selectedPaymentMethod = 'cod';
  customerAddress = '';

  private cartService = inject(CartService);
  private router = inject(Router);
  private orderService = inject(OrderService);
  private customerService = inject(AuthService);

  ngOnInit(): void {
    this.cartService.cartItems$.subscribe((items) => {
      this.cartItems = items;
      this.cartService.cartItems$.subscribe((items) => {
        this.cartItems = items;
      });
      this.loadCustomerAddress();
    });
  }

  increaseQuantity(item: CartItem) {
    this.cartService.updateItemQuantity(item.id, item.quantity + 1);
  }

  decreaseQuantity(item: CartItem) {
    if (item.quantity > 1) {
      this.cartService.updateItemQuantity(item.id, item.quantity - 1);
    } else {
      this.cartService.removeFromCart(item.id);
    }
  }
  removeItem(item: CartItem) {
    this.cartService.removeFromCart(item.id);
  }

  refreshCart() {
    this.cartItems = this.cartService.getCurrentItems();
  }
  deliveryFee = 2;

  getSubtotal(): number {
    return this.cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }

  getTotal(): number {
    return this.getSubtotal() + this.deliveryFee;
  }
  gotostore() {
    this.router.navigate(['/store']);
  }

  goToCheckout() {
    this.router.navigate(['/checkout']);
  }

  submitOrder() {
    const cartItems = this.cartService.getCurrentItems();
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const paymentAmount = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const deliveryRequest: DeliveryRequest = {
      id: Math.floor(Math.random() * 100000).toString(),
      deliveryDetails: this.customerAddress,
      date: new Date().toISOString(),
      customerId: user.id,
      deliveryStatus: 'pending',
      driverId: 0,
      paymentStatus: this.paymentStatus,
      paymentAmount: paymentAmount,
      product: cartItems.map((item) => ({
        id: item.id,
        name: item.name,
        category: item.category,
        price: item.price,
        image: item.image,
        description: item.description,
        material: item.material,
        // idClient: item.idClient,
        quantity: item.quantity,
      })),
    };
    this.orderService.sendOrder(deliveryRequest).subscribe({
      next: () => {
        alert('✅ تم إرسال الطلب بنجاح!');
        this.cartService.clearCart();
      },
      error: () => {
        alert('❌ فشل إرسال الطلب');
      },
    });
  }
  get paymentStatus(): PaymentStatus {
    return this.selectedPaymentMethod === 'cod' ? 'unpaid' : 'paid';
  }
  loadCustomerAddress() {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (user && user.userType === 'customer') {
      this.customerService.getCustomers(user.id).subscribe({
        next: (customer: Customer) => {
          this.customerAddress = customer.address;
        },
      });
    }
  }
}
