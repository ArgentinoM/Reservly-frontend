import { Component, inject, input, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { CatalogService } from '../../services/catalog.service';
import { CatalogComponent } from '../../../shared/catalog/catalog.component';
import { PaginateService } from '../../../shared/components/pagination/pagination.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'list-services-page',
  imports: [CatalogComponent,],
  templateUrl: './list-services-page.component.html',
})
export class ListServicesPageComponent {
  isFilterOpen = signal(false);
  isLoading = signal(false);
  perPage = input<number>(20);
  minimal = input<boolean>(false);
  catalogService = inject(CatalogService);
  paginateService = inject(PaginateService);

  catalogResource = rxResource({
    request: () => ({
      page: this.paginateService.currenPage(),
      perPage: this.perPage(),
    }),
    loader: ({ request }) => {
      this.isLoading.set(true);

      return this.catalogService.getServices({
        page: request.page,
        perPage: request.perPage,
      }).pipe(
        finalize(() => this.isLoading.set(false))
      )
    }
  });
}
