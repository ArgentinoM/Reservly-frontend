import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { Observable, tap } from 'rxjs';
import { Review } from '../interfaces/review.interface';
import { PaginateResponse } from '../interfaces/respose-paginate.interface';

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

    return this.http.get<PaginateResponse<Review>>(`${this.baseUrl}/${this.getReviewEndpoint}/${service_id}`, {
      params: {
        page,
        perPage
      }
    })
    .pipe(
      tap((resp) => this.reviewCache.set(key, resp)),
      tap(x => console.log(x))
    );
  }

}
