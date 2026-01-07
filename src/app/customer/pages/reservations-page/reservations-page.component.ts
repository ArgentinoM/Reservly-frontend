import { CurrencyPipe, DatePipe, Location, NgClass } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { ReservationService } from '../../../core/services/reservations.service';
import { NotificationsComponent } from "../../../shared/components/notifications/notifications.component";
import { PaginationComponent } from "../../../shared/components/pagination/pagination.component";
import { PaginateService } from '../../../shared/components/pagination/pagination.service';
import { SpinerComponent } from "../../../shared/components/spiner/spiner.component";

@Component({
  selector: 'app-reservations-page',
  imports: [RouterLink, DatePipe, CurrencyPipe, PaginationComponent, SpinerComponent, NgClass, NotificationsComponent],
  templateUrl: './reservations-page.component.html',
})
export class ReservationsPageComponent {

  private location = inject(Location);

  paginateService = inject(PaginateService);
  reservationServices = inject(ReservationService);

  perPage = signal<number>(10);
  isLoading = signal(false);

  alertType = signal<'success' | 'error'| 'warning'>('success');
  alertMessage = signal<string>('');
  alertVisible = signal<boolean>(false);
  pendingDelete = signal(false);

  minimal = signal(false);

  idToDelete = signal<number | null>(null);


  reservationResource = rxResource({
    request: () => ({
      page: this.paginateService.currenPage(),
      perPage: this.perPage(),
    }),
    loader: ({ request }) => {
      this.isLoading.set(true);

      return this.reservationServices.getReservations({
        page: request.page,
        perPage: request.perPage,

      }).pipe(
        finalize(() => this.isLoading.set(false))
      );
    }
  });

  deleteService(id: number) {
    this.idToDelete.set(id);
    this.pendingDelete.set(true);

    this.showAlert(
      'warning',
      '¿Estás seguro de que deseas eliminar este servicio? Esta acción no se puede deshacer.'
    );
  }

  confirmDelete() {
    const id = this.idToDelete();

    console.log(id);

    if (!id) return;

    this.pendingDelete.set(false);
    this.alertVisible.set(false);

    this.reservationServices.cancelReservation(id)
      .subscribe({
        next: (resp) => {
          this.showAlert('success', resp.message);

          setTimeout(() => {
            this.location.back();
          }, 3000);
        },
        error: (err) => {
          this.showAlert(
            'error',
            err.error || 'No se pudo eliminar el servicio'
          );
        }
      });
  }

  private showAlert(type: 'success' | 'error' | 'warning', message: string) {
    this.alertType.set(type);
    this.alertMessage.set(message);
    this.alertVisible.set(true);

    setTimeout(() => this.alertVisible.set(false), 5000);
  }

}
