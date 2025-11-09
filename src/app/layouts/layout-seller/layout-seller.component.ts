import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavigateComponent } from "../../shared/components/navigate/navigate.component";
import { ItemsNavigate } from '../../core/interfaces/itemNavigate.interface';

@Component({
  selector: 'app-layout-seller',
  imports: [RouterOutlet, NavigateComponent],
  templateUrl: './layout-seller.component.html',
})
export class LayoutSellerComponent {

    itemsNavigate: ItemsNavigate[] = [
      {
        path: 'services',
        name: 'Mis servicios'
      },
      {
        path: 'reservations',
        name: 'Reservaciones'
      },

    ]

}
