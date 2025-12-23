import { TitleCasePipe } from '@angular/common';
import { Component, computed, inject, input, output, ResourceRef, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { PaginateResponse } from '../../core/interfaces/respose-paginate.interface';
import { Catalog } from '../../customer/interfaces/response-catalog.interface';
import { PaginationComponent } from "../components/pagination/pagination.component";
import { PaginateService } from '../components/pagination/pagination.service';
import { SpinerComponent } from "../components/spiner/spiner.component";
import { FilterComponent } from "../filter/filter.component";
import { CatalogListComponent } from "./catalog-list/catalog-list.component";


@Component({
  selector: 'catalog',
  imports: [CatalogListComponent, PaginationComponent, TitleCasePipe, SpinerComponent, RouterLink, FilterComponent],
  templateUrl: './catalog.component.html',
})
export class CatalogComponent {

  paginateService = inject(PaginateService);
  isFilterOpen = signal(false);
  title = input.required<string>();
  minimal = input<boolean>(false);
  filter = input(true);
  isLoading = input.required();
  router = inject(Router);

  seller = computed(() => this.router.url.includes('seller'));

  data = input.required<ResourceRef<PaginateResponse<Catalog> | undefined>>();
  filtersChanged = output<any>();

  toggleFilter(): void {
    this.isFilterOpen.update(currentValue => !currentValue);
  }

  onFiltersChanged(filters: any): void {
    this.filtersChanged.emit(filters);
  }
}
