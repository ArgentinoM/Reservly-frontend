import { DatePipe, NgClass } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ReservationService } from '../../../core/services/reservations.service';
import { PaginationComponent } from "../../../shared/components/pagination/pagination.component";
import { PaginateService } from '../../../shared/components/pagination/pagination.service';

@Component({
  selector: 'app-info-by-service',
  imports: [DatePipe, NgClass, PaginationComponent],
  templateUrl: './info-by-service.component.html',
})
export class InfoByServiceComponent {

  reservationService = inject(ReservationService);
  paginateService = inject(PaginateService);

  service_id = history.state.id;

  minimal = signal(false);

  reservationResource = rxResource({
    request: () => ({
      page: this.paginateService.currenPage(),
      perPage: 10,
      service: this.service_id
    }),
    loader: ({request}) => {
      return this.reservationService.getReservationbyService({
        page: request.page,
        perPage: request.perPage
      }, request.service)
    }
  })

}
