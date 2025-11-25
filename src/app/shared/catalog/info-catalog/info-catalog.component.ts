import { CurrencyPipe, Location } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { CatalogService } from '../../../customer/services/catalog.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { SpinerComponent } from "../../components/spiner/spiner.component";
import { ReviewService } from '../../../core/services/review.service';
import { CalendarComponent } from "../components/calendar/calendar.component";
import { Router } from '@angular/router';

@Component({
  selector: 'app-info-catalog',
  imports: [SpinerComponent, CurrencyPipe, CalendarComponent],
  templateUrl: './info-catalog.component.html',
})
export class InfoCatalogComponent{

  private location = inject(Location);
  private catalogService = inject(CatalogService);
  private reviewService = inject(ReviewService);
  router = inject(Router);

  private idService = signal(history.state.id)

  isLoading =  signal<boolean>(false);
  stars = [1, 2, 3, 4, 5];
  isCustomer = signal<boolean>(this.router.url.includes('customer'))

  catalogResource = rxResource({
    request: () => ({
      id: this.idService()
    }),
    loader: ({request}) => {

      this.isLoading.set(true);

      return this.catalogService.getServicesById(
        request.id
      ).pipe(
        finalize(() => this.isLoading.set(false))
      );
    }
  })

  reviewResource = rxResource({
    request: () => ({
      service_id: this.idService(),
    }),
    loader: ({request}) => {
      return this.reviewService.getReview({
        service_id: request.service_id
    })
    }
  })

  getStarClass(star: number): string {
    const avg = Number(this.catalogResource.value()?.data.rating?.average_rating);

    if (star <= Math.floor(avg)) {
      return 'fa-solid fa-star';
    } else if (star - avg <= 0.5 && star - avg > 0) {
      return 'fa-solid fa-star-half-stroke';
    } else {
      return 'fa-regular fa-star';
    }
  }

  goBack(){
    this.location.back();
  }

}
