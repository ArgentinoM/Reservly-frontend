import { Component, inject, input, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { CatalogService } from '../../../core/services/catalog.service';
import { CatalogComponent } from '../../../shared/catalog/catalog.component';
import { PaginateService } from '../../../shared/components/pagination/pagination.service';

@Component({
  selector: 'list-services-page',
  imports: [CatalogComponent,],
  templateUrl: './list-services-page.component.html',
})
export class ListServicesPageComponent {
  isFilterOpen = signal(false);
  filters = signal<any>({});
  isLoading = signal(false);
  perPage = input<number>(20);
  minimal = input<boolean>(false);
  catalogService = inject(CatalogService);
  paginateService = inject(PaginateService);

  catalogResource = rxResource({
    request: () => ({
      page: this.paginateService.currenPage(),
      perPage: this.perPage(),
      filters: this.filters(),
    }),
    loader: ({ request }) => {
      this.isLoading.set(true);

      return this.catalogService.getServices({
        page: request.page,
        perPage: request.perPage,
        ...request.filters,
      }).pipe(
        finalize(() => this.isLoading.set(false))
      );
    }
  });


  applyFilters(filters: any) {

    this.filters.set(filters);

    this.paginateService.goToPage(1);

    this.catalogService.catalogCache.clear();

    this.catalogResource.reload();
  }

}
