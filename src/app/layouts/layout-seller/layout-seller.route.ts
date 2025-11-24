import { Routes } from '@angular/router';
import { ListServicesPageComponent } from '../../customer/pages/list-services-page/list-services-page.component';
import { LayoutSellerComponent } from './layout-seller.component';
import { ServicesSellerComponent } from '../../seller/pages/services-seller/services-seller.component';
import { InfoCatalogComponent } from '../../shared/catalog/info-catalog/info-catalog.component';
import { CreateServicesComponent } from '../../seller/pages/create-services/create-services.component';



export const layoutSellerRoutes: Routes = [
  {
    path: '',
    component: LayoutSellerComponent,
    children: [
      {
        path: 'services',
        component: ServicesSellerComponent
      },
      {
        path: 'services/:id',
        component: InfoCatalogComponent
      },
      {
        path: 'create-services',
        component: CreateServicesComponent
      }
    ]
  }
];

export default layoutSellerRoutes;
