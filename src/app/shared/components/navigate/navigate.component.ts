import { TitleCasePipe } from '@angular/common';
import { Component, inject, input, signal, WritableSignal } from '@angular/core';
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

  itemsMenu = input.required<ItemsNavigate[] | null>();

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

}
