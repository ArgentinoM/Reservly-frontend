import { Routes } from '@angular/router';
import { NotAuthenticatedGuard } from './core/guards/not-authenticated.guard';
import { PerfilPageComponent } from './pages/perfil-page/perfil-page.component';
import { HomePageGlobalComponent } from './pages/home-page-global/home-page-global.component';

export const routes: Routes = [
  {
    path: '',
    component: HomePageGlobalComponent,
    // canMatch: [
    //   rootGuard
    // ]
  },
  {
    path: 'customer',
    loadChildren: () => import('./layouts/layout-customer/layout-customer.route'),
  },
  {
    path: 'seller',
    loadChildren: () => import('./layouts/layout-seller/layout-seller.route'),
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
