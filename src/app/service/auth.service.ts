import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Router } from '@angular/router';
import {
  BehaviorSubject,
  catchError,
  map,
  Observable,
  switchMap,
  throwError,
} from 'rxjs';
import { Users } from '../shared/model/user';
import bcrypt from 'bcryptjs';
import { Customer } from '../shared/model/customer';
import { CartService } from './cart.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private usersUrl = 'http://localhost:3000/users';
  private customersUrl = 'http://localhost:3000/customers';
  private loggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  private hasToken(): boolean {
    return (
      typeof window !== 'undefined' &&
      typeof window.localStorage !== 'undefined' &&
      !!localStorage.getItem('currentUser')
    );
  }
  private http = inject(HttpClient);
  private router = inject(Router);
  private cartservice = inject(CartService);
  login(email: string, password: string): Observable<Users> {
    return this.http.get<Users[]>(`${this.usersUrl}?email=${email}`).pipe(
      map((users) => {
        const user = users[0];
        if (!user) throw new Error('User not found');

        // تحقق من كلمة المرور
        if (!this.verifyPassword(user, password)) {
          throw new Error('Invalid email or password');
        }

        // حفظ المستخدم في localStorage بعد التحقق
        this.saveUser(user);

        return user;
      }),
      catchError((err) => throwError(() => err))
    );
  }
  register(
    user: Users & { phone: string; address: string }
  ): Observable<Users> {
    return this.http.get<Users[]>(`${this.usersUrl}?email=${user.email}`).pipe(
      switchMap((existingUsers) => {
        if (existingUsers.length > 0)
          return throwError(() => new Error('Email already exists'));

        const hashedUser: Users = {
          id: user.id,
          name: user.name,
          email: user.email,
          password: bcrypt.hashSync(user.password, 10),
          usertype: user.usertype,
        };

        return this.http.post<Users>(this.usersUrl, hashedUser).pipe(
          switchMap((createdUser) => {
            const customerData = {
              idClient: createdUser.id,
              name: createdUser.name,
              email: createdUser.email,
              phone: user.phone,
              address: user.address,
            };

            return this.http.post(this.customersUrl, customerData).pipe(
              map(() => {
                this.saveUser(createdUser);
                return createdUser;
              })
            );
          })
        );
      }),
      catchError((err) => throwError(() => err))
    );
  }
  private verifyPassword(user: Users, password: string): boolean {
    if (user.usertype === 'admin') {
      return user.password === password;
    }
    return bcrypt.compareSync(password, user.password);
  }

  private saveUser(user: Users) {
    try {
      localStorage.setItem('currentUser', JSON.stringify(user));
      this.loggedInSubject.next(true);
    } catch (err) {
      console.error('Error saving user to localStorage', err);
    }
  }
  isLoggedIn(): boolean {
    return (
      typeof window !== 'undefined' &&
      typeof window.localStorage !== 'undefined' &&
      !!localStorage.getItem('currentUser')
    );
  }
  getCustomers(userId: string): Observable<Customer> {
    return this.http
      .get<Customer[]>(`${this.customersUrl}?idClient=${userId}`)
      .pipe(map((customers) => customers[0]));
  }

  updateCustomer(id: string, data: Customer): Observable<Customer> {
    return this.http.put<Customer>(`${this.customersUrl}/${id}`, data);
  }

  getAllCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(this.customersUrl);
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.loggedInSubject.next(false);
    this.router.navigate(['/login']);
    this.cartservice.clearCart();
  }
}
