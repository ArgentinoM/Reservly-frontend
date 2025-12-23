import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PaymentsData } from '../interfaces/paymentsData';
import { ApiResponse } from '../interfaces/response.interface';

@Injectable({providedIn: 'root'})

export class PaymentsService {
  http =  inject(HttpClient);
  private baseUrl = environment.url_base

  createPaymentIntent(data: PaymentsData): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(
      `${this.baseUrl}/payment_intent`,
      data
    );
  }

}
