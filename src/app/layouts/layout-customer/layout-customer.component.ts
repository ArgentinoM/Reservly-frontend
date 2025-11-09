import { Component } from '@angular/core';

import { ItemsNavigate } from '../../core/interfaces/itemNavigate.interface';
import { RouterOutlet } from '@angular/router';
import { NavigateComponent } from '../../shared/components/navigate/navigate.component';

@Component({
  selector: 'app-layout-customer',
  imports: [NavigateComponent, RouterOutlet],
  templateUrl: './layout-customer.component.html',
})
export class LayoutCustomerComponent {

  itemsNavigate: ItemsNavigate[] = [
    {
      path: 'services',
      name: 'servicios'
    },
    {
      path: 'favorit',
      name: 'Favoritos'
    },
    {
      path: 'reservations',
      name: 'Mis reservaciones'
    },

  ]

}
