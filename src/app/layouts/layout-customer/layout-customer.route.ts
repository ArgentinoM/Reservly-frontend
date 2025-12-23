import { Routes } from '@angular/router';
import { FavoriteServicesPageComponent } from '../../customer/pages/favorite-services-page/favorite-services-page.component';
import { HomePageComponent } from '../../customer/pages/home-page/home-page.component';
import { ListServicesPageComponent } from '../../customer/pages/list-services-page/list-services-page.component';
import { ReservationsPageComponent } from '../../customer/pages/reservations-page/reservations-page.component';
import { PaymentsComponent } from '../../pages/payments/payments.component';
import { InfoCatalogComponent } from '../../shared/catalog/info-catalog/info-catalog.component';
import { LayoutCustomerComponent } from './layout-customer.component';


export const layoutCustomeRoutes: Routes = [
  {
    path: '',
    component: LayoutCustomerComponent,
    children: [
      {
        path: '',
        component: HomePageComponent
      },
      {
        path: 'services',
        component: ListServicesPageComponent
      },
      {
        path: 'services/:name',
        component: InfoCatalogComponent
      },
      {
        path: 'favorit'  ,
        component: FavoriteServicesPageComponent
      },
      {
        path: 'reservations',
        component: ReservationsPageComponent
      },
    ]
  },
  {
    path: 'payments',
    component: PaymentsComponent
  }
];

export default layoutCustomeRoutes;
