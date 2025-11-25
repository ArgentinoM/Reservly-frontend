import { CurrencyPipe, CommonModule } from '@angular/common';
import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FavoriteService } from '../../../customer/services/favorite-catalog.service';
import { NotificationsComponent } from "../../components/notifications/notifications.component";
import { ApiResponse, ErrorResponse, MessageResponse } from '../../../core/interfaces/response.interface';

@Component({
  selector: 'catalog-list',
  imports: [CommonModule, CurrencyPipe, RouterLink, NotificationsComponent],
  templateUrl: './catalog-list.component.html',
})
export class CatalogListComponent{

  router = inject(Router);

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
  alertVisible = signal(false);
  alertType = signal<'success' | 'error'>('success');
  alertMessage = signal<string>('');

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
      this.favoriteService.deleteFavorite(this.ServiceId()).subscribe({
        next: (resp) =>  {
          this.handleSucces(resp)
        },
        error: (error) => {
          this.handleError(error)
        }
      });
    } else {
      this.favoriteService.storeFavorite(this.ServiceId()).subscribe({
        next: (resp) =>  {
          this.handleSucces(resp)
        },
        error: (error) => {
          this.handleError(error)
        }
      });
    }
  }

  private handleSucces<T>(resp : ApiResponse<T> | MessageResponse){
    this.alertVisible.set(true)
    this.alertType.set('success');

    this.alertMessage.set(resp.message)
  }

  private handleError(resp : ErrorResponse){
    this.alertVisible.set(true)
    this.alertType.set('error');
    this.alertMessage.set(resp.error)
  }

}
