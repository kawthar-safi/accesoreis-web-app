import { Routes } from '@angular/router';
import { StoreComponent } from './pages/store/store.component';
import { authGuard } from './shared/guards/AuthGuard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'store',
    loadComponent: () =>
      import('./pages/store/store.component').then((m) => m.StoreComponent),
  },
  // { path: 'store', component: StoreComponent },
  { path: 'store/category/:category', component: StoreComponent },
  { path: 'store/material/:material', component: StoreComponent },

  {
    path: 'login',
    loadComponent: () =>
      import('./pages/auth/login/login.component').then(
        (m) => m.LoginComponent
      ),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/auth/register/register.component').then(
        (m) => m.RegisterComponent
      ),
  },
  {
    path: 'user-profile',
    loadComponent: () =>
      import('./shared/components/user-profile/user-profile.component').then(
        (m) => m.UserProfileComponent
      ),
    canActivate: [authGuard],
  },
  {
    path: 'cart',
    loadComponent: () =>
      import('./pages/cart/cart.component').then((m) => m.CartComponent),
  },
];
