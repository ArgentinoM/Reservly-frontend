import { Component, computed, inject, input, OnInit, ResourceRef, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { PaginateService } from '../../../shared/components/pagination/pagination.service';
import { FavoriteService } from '../../services/favorite-catalog.service';
import { CatalogComponent } from "../../../shared/catalog/catalog.component";

import { Catalog } from '../../interfaces/response-catalog.interface';
import { PaginateResponse } from '../../../core/interfaces/respose-paginate.interface';
import { finalize } from 'rxjs';
import { PaginationComponent } from "../../../shared/components/pagination/pagination.component";


@Component({
  selector: 'favorite-services-page',
  imports: [CatalogComponent, PaginationComponent],
  templateUrl: './favorite-services-page.component.html',
})
export class FavoriteServicesPageComponent implements OnInit {
  ngOnInit(): void {
    this.favoriteResource.reload();
  }

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
