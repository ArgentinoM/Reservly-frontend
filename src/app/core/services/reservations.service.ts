import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Reservations } from '../interfaces/reservations.interface';
import { MessageResponse } from '../interfaces/response.interface';
import { PaginateResponse } from '../interfaces/respose-paginate.interface';

interface Options {
  page: number,
  perPage: number
}

@Injectable({providedIn: 'root'})

export class ReservationService {

  private http = inject(HttpClient);
  private baseUrl =  environment.url_base;
  private reservationEndpoint = environment.reservation_endpoin;

  private reservationCache = new Map<string, PaginateResponse<Reservations>>();
  private reservationByServiceCache = new Map<string, PaginateResponse<Reservations>>();

  private _total = signal<number>(0);

  totalSeller = computed(() => this._total);

  getReservations(options: Options): Observable<PaginateResponse<Reservations>>{

    const {
      page = 1,
      perPage = 4
    } = options

    const key = `${page}-${perPage}`;

    const cached = this.reservationCache.get(key);

    if (cached) {
      return of(cached);
    }

    return this.http.get<PaginateResponse<Reservations>>(`${this.baseUrl}/${this.reservationEndpoint}`, {
      params: {
        page,
        perPage
      }
    })
    .pipe(
      tap((resp) => this.reservationCache.set(key, resp)),
      tap(({meta}) => this._total.set(meta.total))
    );
  }

  getReservationbyService(options: Options, id_service: number): Observable<PaginateResponse<Reservations>>{

    const {
      page = 1,
      perPage = 4
    } = options

    const key = `${page}-${perPage}`;

    const cached = this.reservationByServiceCache.get(key);

    if (cached) {
      return of(cached);
    }

    return this.http.get<PaginateResponse<Reservations>>(`${this.baseUrl}/${this.reservationEndpoint}/${id_service}`, {
      params: {
        page,
        perPage
      }
    })
    .pipe(
      tap((resp) => this.reservationByServiceCache.set(key, resp)),
    );
  }

  cancelReservation(id_reservation: number): Observable<MessageResponse>{
    return this.http.post<MessageResponse>(`${this.baseUrl}/${this.reservationEndpoint}/${id_reservation}/cancel`, {})
      .pipe(
        tap(() => this.updateReservationStatusInCache(id_reservation, 'cancelado'))
      );
  }

  addReservationToCache(reservation: Reservations) {
    this.reservationCache.forEach((cachedResponse, key) => {

      cachedResponse.data = [reservation, ...cachedResponse.data];
      cachedResponse.meta.total += 1;

      this.reservationCache.set(key, cachedResponse);
  });
  }

  private updateReservationStatusInCache(reservationId: number,newStatus: string) {

    this.reservationCache.forEach((cachedResponse, key) => {
      cachedResponse.data = cachedResponse.data.map(reservation =>
        reservation.id === reservationId
          ? { ...reservation, status: newStatus }
          : reservation
      );

      this.reservationCache.set(key, cachedResponse);
    });

    this.reservationByServiceCache.forEach((cachedResponse, key) => {
      cachedResponse.data = cachedResponse.data.map(reservation =>
        reservation.id === reservationId
          ? { ...reservation, status: newStatus }
          : reservation
      );

      this.reservationByServiceCache.set(key, cachedResponse);
    });
  }

  markAsPaidInCache(reservationId: number) {
    this.updateReservationStatusInCache(reservationId, 'confirmado');
  }


}
