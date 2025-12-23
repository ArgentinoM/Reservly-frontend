import { CurrencyPipe, Location } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { CatalogService } from '../../../core/services/catalog.service';
import { ReviewService } from '../../../core/services/review.service';
import { NotificationsComponent } from "../../components/notifications/notifications.component";
import { SpinerComponent } from "../../components/spiner/spiner.component";
import { CalendarComponent } from "../components/calendar/calendar.component";

@Component({
  selector: 'app-info-catalog',
  imports: [SpinerComponent, CurrencyPipe, CalendarComponent, RouterLink, NotificationsComponent],
  templateUrl: './info-catalog.component.html',
})
export class InfoCatalogComponent{

  private location = inject(Location);
  private catalogService = inject(CatalogService);
  private reviewService = inject(ReviewService);

  private idService = signal(history.state.id)

  router = inject(Router);
  isLoading =  signal<boolean>(false);
  stars = [1, 2, 3, 4, 5];
  isCustomer = signal<boolean>(this.router.url.includes('customer'));

  errors = signal<string[]>([]);
  isPosting = signal(false);
  alertVisible = signal(false);
  alertType: 'success' | 'error' | 'warning' = 'success';
  alertMessage = signal('');
  pendingDelete = signal(false);


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
      service_id: this.idService()
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

  confirmDelete(){
    this.pendingDelete.set(false);
    this.alertVisible.set(false);

    this.catalogService.deleteService(this.idService())
    .subscribe({
      next: (resp) => {
        this.showAlert('success', resp.message);

        setTimeout(() => {
          this.location.back();
        }, 3000);

      },
      error: (err) => {
        this.showAlert('error', err.error || 'No se pudo eliminar el servicio');
      }
    });
  }

  deleteService() {
    this.pendingDelete.set(true);

    this.showAlert(
      'warning',
      '¿Estás seguro de que deseas eliminar este servicio? Esta acción no se puede deshacer.'
    );
  }

  goBack(){
    this.location.back();
  }

  private showAlert(type: 'success' | 'error' | 'warning', message: string) {
    this.alertType = type;
    this.alertMessage.set(message);
    this.alertVisible.set(true);

    setTimeout(() => this.alertVisible.set(false), 5000);
  }
}
