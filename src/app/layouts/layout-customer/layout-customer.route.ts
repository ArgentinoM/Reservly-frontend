import { Routes } from '@angular/router';
import { ListServicesPageComponent } from '../../customer/pages/list-services-page/list-services-page.component';
import { LayoutCustomerComponent } from './layout-customer.component';


export const layoutCustomeRoutes: Routes = [
  {
    path: '',
    component: LayoutCustomerComponent,
    children: [
      {
        path: 'services',
        component: ListServicesPageComponent
      }
    ]
  }
];

export default layoutCustomeRoutes;
