import { DatePipe, NgClass } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ReservationService } from '../../../core/services/reservations.service';
import { PaginationComponent } from "../../../shared/components/pagination/pagination.component";
import { PaginateService } from '../../../shared/components/pagination/pagination.service';

@Component({
  selector: 'app-reservations-seller',
  imports: [NgClass, DatePipe, PaginationComponent],
  templateUrl: './reservations-seller.component.html',
})
export class ReservationsSellerComponent {

  reservationService = inject(ReservationService);
  paginateService = inject(PaginateService);

  minimal = signal(false);

  reservationResource = rxResource({
    request: () => ({
      page: this.paginateService.currenPage(),
      perPage: 10,
    }),
    loader: ({request}) => {
      return this.reservationService.getReservations({
        page: request.page,
        perPage: request.perPage
      })
    }
  })




}
