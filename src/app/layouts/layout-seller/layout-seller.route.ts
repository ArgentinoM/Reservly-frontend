import { Routes } from '@angular/router';
import { CreateUpdateServicesComponent } from '../../seller/pages/createUpdate-services/createUpdate-services.component';
import { HomeSellerComponent } from '../../seller/pages/home-seller/home-seller.component';
import { ServicesSellerComponent } from '../../seller/pages/services-seller/services-seller.component';
import { InfoCatalogComponent } from '../../shared/catalog/info-catalog/info-catalog.component';
import { LayoutSellerComponent } from './layout-seller.component';



export const layoutSellerRoutes: Routes = [
  {
    path: '',
    component: LayoutSellerComponent,
    children: [
      {
        path: '',
        component: HomeSellerComponent
      },
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
        component: CreateUpdateServicesComponent
      },
      {
        path: 'update-service/:id',
        component: CreateUpdateServicesComponent
      }
    ]
  }
];

export default layoutSellerRoutes;
