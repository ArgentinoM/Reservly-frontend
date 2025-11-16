import { Component, inject, input, signal, WritableSignal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ItemsNavigate } from '../../../core/interfaces/itemNavigate.interface';
import { AuthService } from '../../../auth/services/auth.service';
import { TitleCasePipe } from '@angular/common';



@Component({
  selector: 'navigate',
  imports: [RouterModule ,TitleCasePipe],
  templateUrl: './navigate.component.html',
})
export class NavigateComponent {

  authService = inject(AuthService);

  itemsMenu = input.required<ItemsNavigate[] | null>();

  dropdownOpen: WritableSignal<boolean> = signal(false);

  toggleDropdown(): void {
    this.dropdownOpen.update(currentValue => !currentValue);
  }

}
