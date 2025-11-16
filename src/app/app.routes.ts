import { Routes } from '@angular/router';
import { NotAuthenticatedGuard } from './core/guards/not-authenticated.guard';
import { PerfilPageComponent } from './pages/perfil-page/perfil-page.component';
import { SellerGuard } from './core/guards/seller.guard';
import { HomePageGlobalComponent } from './pages/home-page-global/home-page-global.component';
import { AuthenticatedGuard } from './core/guards/autheticated.guard';

export const routes: Routes = [
  {
    path: '',
    component: HomePageGlobalComponent,
    // canMatch: [
    //   NotAuthenticatedGuard
    // ]
  },
  {
    path: 'customer',
    loadChildren: () => import('./layouts/layout-customer/layout-customer.route'),
    canMatch: [
      AuthenticatedGuard
    ]
  },
  {
    path: 'seller',
    loadChildren: () => import('./layouts/layout-seller/layout-seller.route'),
    canMatch: [
      SellerGuard,
      AuthenticatedGuard
    ]
  },
  {
    path: 'perfil',
    component: PerfilPageComponent
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
