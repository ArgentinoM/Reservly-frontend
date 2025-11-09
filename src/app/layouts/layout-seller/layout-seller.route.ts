import { Routes } from '@angular/router';
import { ListServicesPageComponent } from '../../customer/pages/list-services-page/list-services-page.component';
import { LayoutSellerComponent } from './layout-seller.component';
import { ServicesSellerComponent } from '../../seller/pages/services-seller/services-seller.component';



export const layoutSellerRoutes: Routes = [
  {
    path: '',
    component: LayoutSellerComponent,
    children: [
      {
        path: 'services',
        component: ServicesSellerComponent
      }
    ]
  }
];

export default layoutSellerRoutes;
