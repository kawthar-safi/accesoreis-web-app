import { Routes } from '@angular/router';
import { StoreComponent } from './pages/store/store.component';

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
  { path: 'store/:category', component: StoreComponent },
];
