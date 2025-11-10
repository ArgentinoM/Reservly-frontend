import { Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { CatalogService } from '../../services/catalog.service';
import { CatalogComponent } from '../../../shared/catalog/catalog.component';
import { FilterComponent } from "../../../shared/filter/filter.component";
import { PaginationComponent } from "../../../shared/components/pagination/pagination.component";
import { PaginateService } from '../../../shared/components/pagination/pagination.service';
import { Filter } from '../../../shared/filter/filter.interface';

@Component({
  selector: 'list-services-page',
  imports: [CatalogComponent, FilterComponent, PaginationComponent],
  templateUrl: './list-services-page.component.html',
})
export class ListServicesPageComponent {
  isFilterOpen = signal(false);
  catalogService = inject(CatalogService);
  // filters = signal<Filter>({});
  paginateService = inject(PaginateService);

  toggleFilter(): void {
    this.isFilterOpen.update(currentValue => !currentValue);
  }

  // onFiltersChanged(filters: Filter) {
  //   console.log('Filtros recibidos:', filters);
  //   this.filters.set(filters);
  // }

  catalogResource = rxResource({
    request: () => ({
      page: this.paginateService.currenPage()
    }),
    loader: ({ request }) => {
      return this.catalogService.getServices({
        page: request.page,
      });
    }
  });
}
