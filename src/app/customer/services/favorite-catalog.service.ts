import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Favorite } from '../interfaces/response-favorite.interface';
import { catchError, Observable, of, tap } from 'rxjs';
import { PaginateResponse } from '../../core/interfaces/respose-paginate.interface';
import { ApiResponse, MessageResponse } from '../../core/interfaces/response.interface';

interface OptionsPage {
  page?: number;
  perPage?: number;
}

@Injectable({providedIn: 'root'})

export class FavoriteService {

  private http = inject(HttpClient);
  private baseUrl = environment.url_base;
  private getFavoriteEndpoint = environment.getFavorite_endpoint;
  private storeFavoriteEndpoint = environment.storeFavorite_endpoint;
  private deleteFavoriteEndpoint = environment.deleteFavorite_endpoint;

  private _totalFavorites = signal<number>(0);

  private favoriteCache = new Map<string, PaginateResponse<Favorite>>();

  total = computed(() => this._totalFavorites());
   favoritesIds = signal<number[]>([]);

  getFavorites(options: OptionsPage): Observable<PaginateResponse<Favorite>> {
     const {
      perPage = 20,
      page = 0,
    } = options;

     const key = `${page}-${perPage}`;

     if(this.favoriteCache.has(key)){
      return of(this.favoriteCache.get(key)!);
     }

    return this.http.get<PaginateResponse<Favorite>>(
      `${this.baseUrl}/${this.getFavoriteEndpoint}`,
      {
        params: {
          perPage,
          page,
        },
      }
    ).pipe(
      tap((resp) => {
        const ids = resp.data.map((fav) => fav.service.id);
        this.favoritesIds.set(ids)
      }),
      tap((resp) => this.favoriteCache.set(key ,resp)),
      tap((resp) => this._totalFavorites.set(resp.meta.total))
    );
  }

  storeFavorite(service_id: number): Observable<ApiResponse<Favorite>>{
    return this.http.post<ApiResponse<Favorite>>(`${this.baseUrl}/${this.storeFavoriteEndpoint}`, {service_id}).pipe(
      tap((resp) => {
        const newFav = resp.data;

        this.favoritesIds.update((ids) =>
          ids.includes(service_id) ? ids : [...ids, service_id]
        );

        for (const [key, page] of this.favoriteCache.entries()) {
          this.favoriteCache.set(key, {
            ...page,
            data: [newFav, ...page.data]
          });
        }
      })
    )
  }

  deleteFavorite(service_id: number): Observable<MessageResponse>{
    return this.http.delete<MessageResponse>(`${this.baseUrl}/${this.deleteFavoriteEndpoint}/${service_id}`).pipe(
      tap(() => {
        this.favoritesIds.update((ids) =>
          ids.filter((id) => id !== service_id)
        );


        for (const [key, page] of this.favoriteCache.entries()) {
          this.favoriteCache.set(key, {
            ...page,
            data: page.data.filter((fav) => fav.service.id !== service_id),
          });
        }
      })
    )
  }

  isFavorite(serviceId: number): boolean {
    return this.favoritesIds().includes(serviceId);
  }

}
