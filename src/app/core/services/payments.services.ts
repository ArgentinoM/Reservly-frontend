import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PaymentIntentResponse, PaymentsData } from '../interfaces/paymentsData';
import { MessageResponse } from '../interfaces/response.interface';
import { ReservationService } from './reservations.service';

@Injectable({providedIn: 'root'})

export class PaymentsService {
  private http =  inject(HttpClient);
  private reservationService = inject(ReservationService);
  private baseUrl = environment.url_base
  private paymentsEndpoint = environment.payments_endpoint;
  private reservationEndpoint = environment.reservation_endpoin;

  private _clientSecret = signal<string>('');


  clientSecret = computed(() => this._clientSecret());

  createPaymentIntent(data: PaymentsData): Observable<PaymentIntentResponse> {
    return this.http.post<PaymentIntentResponse>(
      `${this.baseUrl}/${this.paymentsEndpoint}`,
      data
    ).pipe(
      tap(response => {
        this._clientSecret.set(response.client_secret);

        const newReservation = response.reservation;

        if(newReservation){
          this.reservationService.addReservationToCache(newReservation);
        }
      })
    );
  }

  continuePayment(reservation_id: number): Observable<{ "client_secret": string }>{
    return this.http.post<{ "client_secret": string }>(`${this.baseUrl}/${this.paymentsEndpoint}/${reservation_id}/continue`, {})
  }

  getReservationStatus(id: number): Observable<MessageResponse>{
    return this.http.get<MessageResponse>(`${this.baseUrl}/${this.reservationEndpoint}/${id}/status`);
  }

  markReservationAsPaid(reservationId: number) {
    this.reservationService.markAsPaidInCache(reservationId);
  }


}
