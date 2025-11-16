import { CurrencyPipe, CommonModule } from '@angular/common';
import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FavoriteService } from '../../../customer/services/favorite-catalog.service';

@Component({
  selector: 'catalog-list',
  imports: [CommonModule, CurrencyPipe, RouterLink],
  templateUrl: './catalog-list.component.html',
})
export class CatalogListComponent{

  favoriteService = inject(FavoriteService);

  ServiceId = input.required<number>();
  ServiceName = input.required<string>();
  ServiceDesc = input.required<string>();
  ServicePrice = input.required<number>();
  ServiceImgUrl = input.required<string>();
  RatingAverage = input<string | null>();
  RatingTotal = input.required<number>();

  isFavorite = computed(() => this.favoriteService.isFavorite(this.ServiceId()));

  stars = [1, 2, 3, 4, 5];

  getStarClass(star: number): string {
    const avg = Number(this.RatingAverage());
    if (star <= Math.floor(avg)) {
      return 'fa-solid fa-star';
    } else if (star - avg <= 0.5 && star - avg > 0) {
      return 'fa-solid fa-star-half-stroke';
    } else {
      return 'fa-regular fa-star';
    }
  }

  toSlug(name: string): string {
    return name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '_');
  }

  toggleFavorite() {
    if (this.isFavorite()) {
      this.favoriteService.deleteFavorite(this.ServiceId()).subscribe();
    } else {
      this.favoriteService.storeFavorite(this.ServiceId()).subscribe();
    }
  }

}
