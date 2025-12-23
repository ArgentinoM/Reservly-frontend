import { Routes } from '@angular/router';
import { NotAuthenticatedGuard } from './core/guards/not-authenticated.guard';
import { RolGuard } from './core/guards/rol.guard';
import { HomePageGlobalComponent } from './pages/home-page-global/home-page-global.component';
import { PerfilPageComponent } from './pages/perfil-page/perfil-page.component';

export const routes: Routes = [
  {
    path: '',
    component: HomePageGlobalComponent,
  },
  {
    path: 'customer',
    loadChildren: () => import('./layouts/layout-customer/layout-customer.route'),
    canActivate: [
      RolGuard
    ],
    data: {
      rol: 'user'
    }
  },
  {
    path: 'seller',
    loadChildren: () => import('./layouts/layout-seller/layout-seller.route'),
    canActivate: [
      RolGuard
    ],
    data: {
      rol: 'seller'
    }
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
