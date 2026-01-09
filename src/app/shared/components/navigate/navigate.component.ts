import { TitleCasePipe } from '@angular/common';
import { Component, computed, inject, signal, WritableSignal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { ItemsNavigate } from '../../../core/interfaces/itemNavigate.interface';



@Component({
  selector: 'navigate',
  imports: [RouterModule ,TitleCasePipe],
  templateUrl: './navigate.component.html',
})

export class NavigateComponent {

  authService = inject(AuthService);
  routes =  inject(Router)

  itemsMenu = computed(() => {
    const rol = this.authService.roles();
    if (!rol) return null;

    switch(rol.name){
      case 'user':
         return this.itemsNavigateCustomer;
      case 'seller':
        return this.itemsNavigateSeller;
    }

    return null;
  });

  dropdownOpen: WritableSignal<boolean> = signal(false);

  toggleDropdown(): void {
    this.dropdownOpen.update(currentValue => !currentValue);
  }

  logout(){
    this.authService.logout().subscribe({
      next: () => this.routes.navigateByUrl('/'),

    }
    )
  }

  private itemsNavigateCustomer: ItemsNavigate[] = [
    {
      path: '/customer/services',
      name: 'servicios'
    },
    {
      path: '/customer/favorit',
      name: 'Favoritos'
    },
    {
      path: '/customer/reservations',
      name: 'Mis reservaciones'
    },

  ]

  private itemsNavigateSeller: ItemsNavigate[] = [
    {
      path: '/seller/services',
      name: 'servicios'
    },
    {
      path: '/seller/reservations',
      name: 'Reservaciones'
    },

  ]

}
