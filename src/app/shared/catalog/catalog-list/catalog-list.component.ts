import { CurrencyPipe, NgFor, NgStyle } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'catalog-list',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './catalog-list.component.html',
})
export class CatalogListComponent {

  ServiceId = input.required<number>();
  ServiceName = input.required<string>();
  ServiceDesc = input.required<string>();
  ServicePrice = input.required<number>();
  ServiceImgUrl = input.required<string>();
  RatingAverage = input.required<string>();
  RatingTotal = input.required<number>();

}
