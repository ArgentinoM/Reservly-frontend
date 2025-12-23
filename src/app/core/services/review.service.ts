import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PaginateResponse } from '../interfaces/respose-paginate.interface';
import { Review } from '../interfaces/review.interface';

interface Options {
  service_id: number,
  page?: number,
  perPage?: number
}

@Injectable({providedIn: 'root'})

export class ReviewService {

  private http = inject(HttpClient);
  private baseUrl =  environment.url_base;
  private getReviewEndpoint = environment.getReviews_endpoint;

  private reviewCache = new Map<string, PaginateResponse<Review>>()

  getReview(options: Options): Observable<PaginateResponse<Review>>{

    const {
      service_id,
      page = 1,
      perPage = 4
    } = options

    const key = `${service_id}-${page}-${perPage}`;

    const cached = this.reviewCache.get(key);

    if (cached) {
      return of(cached);
    }

    return this.http.get<PaginateResponse<Review>>(`${this.baseUrl}/${this.getReviewEndpoint}/${service_id}`, {
      params: {
        page,
        perPage
      }
    })
    .pipe(
      tap((resp) => this.reviewCache.set(key, resp)),
    );
  }

}
