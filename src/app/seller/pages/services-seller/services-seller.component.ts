import { Component, inject, signal } from '@angular/core';
import { CatalogComponent } from "../../../shared/catalog/catalog.component";
import { rxResource } from '@angular/core/rxjs-interop';
import { CatalogService } from '../../../customer/services/catalog.service';
import { PaginateService } from '../../../shared/components/pagination/pagination.service';
import { finalize } from 'rxjs';

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
