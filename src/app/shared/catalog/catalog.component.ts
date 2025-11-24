import { Component, computed, inject, input, OnInit, ResourceRef, signal } from '@angular/core';
import { CatalogListComponent } from "./catalog-list/catalog-list.component";
import { Catalog } from '../../customer/interfaces/response-catalog.interface';
import { PaginateResponse } from '../../core/interfaces/respose-paginate.interface';
import { PaginationComponent } from "../components/pagination/pagination.component";
import { PaginateService } from '../components/pagination/pagination.service';
import { TitleCasePipe } from '@angular/common';
import { SpinerComponent } from "../components/spiner/spiner.component";
import { Router, RouterLink } from '@angular/router';


@Component({
  selector: 'catalog',
  imports: [CatalogListComponent, PaginationComponent, TitleCasePipe, SpinerComponent, RouterLink],
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

  toggleFilter(): void {
    this.isFilterOpen.update(currentValue => !currentValue);
  }
}
