import { Component, inject } from '@angular/core';
import { RouterLink } from "@angular/router";
import { AuthService } from '../../../auth/services/auth.service';
import { CatalogService } from '../../../core/services/catalog.service';
import { FavoriteService } from '../../services/favorite-catalog.service';
import { FavoriteServicesPageComponent } from "../favorite-services-page/favorite-services-page.component";
import { ListServicesPageComponent } from "../list-services-page/list-services-page.component";

@Component({
  selector: 'app-home-page',
  imports: [ListServicesPageComponent, FavoriteServicesPageComponent, RouterLink],
  templateUrl: './home-page.component.html',
})
export class HomePageComponent {

  catalogService = inject(CatalogService);
  favoriteService = inject(FavoriteService);
  authService =  inject(AuthService);

}
