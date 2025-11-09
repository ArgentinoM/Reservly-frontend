import { Component, input, OnInit, ResourceRef } from '@angular/core';
import { CatalogListComponent } from "./catalog-list/catalog-list.component";
import { Catalog } from './interfaces/response-catalog.interface';
import { PaginatedApiResponse } from '../../core/interfaces/respose-paginate.interface';

@Component({
  selector: 'catalog',
  imports: [CatalogListComponent],
  templateUrl: './catalog.component.html',
})
export class CatalogComponent {

  data = input.required<ResourceRef<PaginatedApiResponse<Catalog> | undefined>>();

}
