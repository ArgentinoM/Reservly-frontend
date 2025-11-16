import { Component, computed, inject } from '@angular/core';
import { AuthService } from '../../auth/services/auth.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-perfil-page',
  imports: [],
  templateUrl: './perfil-page.component.html',
})
export class PerfilPageComponent {

  authService = inject(AuthService);
  location =  inject(Location)

  user = computed(() => this.authService.user());

  goBack(){
    this.location.back()
  }

}
