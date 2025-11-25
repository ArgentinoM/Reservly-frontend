import { Component, inject } from '@angular/core';
import { ListServicesPageComponent } from "../list-services-page/list-services-page.component";
import { FavoriteServicesPageComponent } from "../favorite-services-page/favorite-services-page.component";
import { CatalogService } from '../../services/catalog.service';
import { RouterLink } from "@angular/router";
import { FavoriteService } from '../../services/favorite-catalog.service';
import { AuthService } from '../../../auth/services/auth.service';

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
