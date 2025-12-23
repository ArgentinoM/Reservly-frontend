import { Component, computed, inject, input, ResourceRef, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { CatalogComponent } from "../../../shared/catalog/catalog.component";
import { PaginateService } from '../../../shared/components/pagination/pagination.service';
import { FavoriteService } from '../../services/favorite-catalog.service';

import { finalize } from 'rxjs';
import { PaginateResponse } from '../../../core/interfaces/respose-paginate.interface';
import { Catalog } from '../../interfaces/response-catalog.interface';


@Component({
  selector: 'favorite-services-page',
  imports: [CatalogComponent],
  templateUrl: './favorite-services-page.component.html',
})
export class FavoriteServicesPageComponent {

  favoriteService = inject(FavoriteService);
  paginateService = inject(PaginateService);

  isLoading = signal(false);
  minimal = input<boolean>(false);
  perPage = input<number>(20);

  favoriteResource = rxResource({
    request: () => ({
      page: this.paginateService.currenPage(),
      perPage: this.perPage(),
    }),
    loader: ({ request }) => {
      this.isLoading.set(true);

      return this.favoriteService.getFavorites({
        page: request.page,
        perPage: request.perPage,
      }).pipe(
        finalize(() => this.isLoading.set(false))
      );
    }
  });

  catalogFromFavorites = {
    value: computed(() => {
      const favorites = this.favoriteResource.value();
      if (!favorites) return [];

      return {
        ...favorites,
        data: favorites.data.map(fav => fav.service)
      };
    })
  } as unknown as ResourceRef<PaginateResponse<Catalog> | undefined>;

}
