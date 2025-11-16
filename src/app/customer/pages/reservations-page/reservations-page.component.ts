import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PaginationComponent } from "../../../shared/components/pagination/pagination.component";

@Component({
  selector: 'app-reservations-page',
  imports: [RouterLink, PaginationComponent],
  templateUrl: './reservations-page.component.html',
})
export class ReservationsPageComponent {

}
