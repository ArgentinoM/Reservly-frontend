import { Component, inject, input, signal, WritableSignal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ItemsNavigate } from '../../../core/interfaces/itemNavigate.interface';
import { AuthService } from '../../../auth/services/auth.service';



@Component({
  selector: 'navigate',
  imports: [RouterLink],
  templateUrl: './navigate.component.html',
})
export class NavigateComponent {

  authService = inject(AuthService);

  itemsMenu = input.required<ItemsNavigate[]>();

  dropdownOpen: WritableSignal<boolean> = signal(false);

  toggleDropdown(): void {
    this.dropdownOpen.update(currentValue => !currentValue);
  }

}
