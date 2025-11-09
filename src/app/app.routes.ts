import { Routes } from '@angular/router';
import { NotAuthenticatedGuard } from './core/guards/not-authenticated.guard';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./layouts/layout-customer/layout-customer.route'),
  },
  {
    path: 'seller',
    loadChildren: () => import('./layouts/layout-seller/layout-seller.route'),
    // canMatch: [
    //   SellerGuard
    // ]
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes'),
    canMatch: [
      NotAuthenticatedGuard
    ]
  },
  {
    path: '**',
    redirectTo: ''
  },

];
