import { Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { CatalogService } from '../../../core/services/catalog.service';
import { CatalogComponent } from "../../../shared/catalog/catalog.component";
import { PaginateService } from '../../../shared/components/pagination/pagination.service';

@Component({
  selector: 'app-services-seller',
  imports: [CatalogComponent],
  templateUrl: './services-seller.component.html',
})
export class ServicesSellerComponent {

  isLoading = signal(false);
  catalogService = inject(CatalogService);
  paginateService = inject(PaginateService);

  catalogResource = rxResource({
    request: () => ({
      page: this.paginateService.currenPage(),
    }),
    loader: ({ request }) => {
      this.isLoading.set(true);

      return this.catalogService.getServices({
        page: request.page,
      }).pipe(
        finalize(() => this.isLoading.set(false))
      )
    }
  });

}
