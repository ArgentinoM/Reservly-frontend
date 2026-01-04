import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PaymentIntentResponse, PaymentsData } from '../interfaces/paymentsData';

@Injectable({providedIn: 'root'})

export class PaymentsService {
  http =  inject(HttpClient);
  private baseUrl = environment.url_base
  private paymentsEndpoint = environment.payments_endpoint;

  private _clientSecret = signal<string>('');


  clientSecret = computed(() => this._clientSecret());

  createPaymentIntent(data: PaymentsData): Observable<PaymentIntentResponse> {
    return this.http.post<PaymentIntentResponse>(
      `${this.baseUrl}/${this.paymentsEndpoint}`,
      data
    ).pipe(
      tap(response => {
        this._clientSecret.set(response.client_secret);
      })
    );
  }

}
