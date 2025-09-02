import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../../service/auth.service';
import { Customer } from '../../model/customer';
import { Users } from '../../model/user';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../../service/cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  imports: [CommonModule, FormsModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss',
})
export class UserProfileComponent implements OnInit {
  private authService = inject(AuthService);
  private cartservice = inject(CartService);
  private router = inject(Router);

  currentUser: Users | null = null;
  currentCustomer: Customer | null = null;

  editing = false;
  editedCustomer: Customer | null = null;

  ngOnInit(): void {
    const userData = localStorage.getItem('currentUser');

    if (userData) {
      this.currentUser = JSON.parse(userData);
      if (this.currentUser?.id) {
        this.authService
          .getCustomers(this.currentUser.id.toString())
          .subscribe({
            next: (customer) => {
              this.currentCustomer = customer;
              this.editedCustomer = { ...customer };
            },
            error: (err) => console.error(err),
          });
      }
    }
  }

  enableEdit() {
    this.editing = true;
    if (this.currentCustomer) {
      this.editedCustomer = { ...this.currentCustomer };
    }
  }

  saveChanges() {
    if (this.editedCustomer) {
      this.authService
        .updateCustomer(this.editedCustomer.id, this.editedCustomer)
        .subscribe({
          next: (updatedCustomer) => {
            this.currentCustomer = updatedCustomer;
            this.editing = false;
          },
          error: (err) => console.error('Failed to update:', err),
        });
    }
  }

  cancelEdit() {
    this.editing = false;
    if (this.currentCustomer) {
      this.editedCustomer = { ...this.currentCustomer };
    }
  }

  logout() {
    this.authService.logout();
    this.cartservice.clearCart();
    this.router.navigate(['/']);
  }
}
