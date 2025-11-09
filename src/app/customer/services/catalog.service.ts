import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable, of, tap } from 'rxjs';
import {  PaginatedApiResponse } from '../../core/interfaces/respose-paginate.interface';
import { Catalog } from '../../shared/catalog/interfaces/response-catalog.interface';

interface Options {
  page?: number;
  perPage?: number;
  category?: number;
  price_min?: number;
  price_max?: number;
  // duration?: number;
  // date?: string;
  name?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CatalogService {

  private http = inject(HttpClient);
  private baseUrl = environment.url_base;
  private getServicesEndpoint = environment.getServices_endpoint;

  private catalogCache = new Map<string, PaginatedApiResponse<Catalog>>();

getServices(options: Options): Observable<PaginatedApiResponse<Catalog>> {
   const {
    perPage = 20,
    page = 0,
  } = options;

   const key = `${page}-${perPage}`;

   if(this.catalogCache.has(key)){
    return of(this.catalogCache.get(key)!);
   }

  return this.http.get<PaginatedApiResponse<Catalog>>(
    `${this.baseUrl}/${this.getServicesEndpoint}`,
    {
      params: {
        perPage,
        page,
      },
    }
  ).pipe(
    tap(x => console.log('Respuesta recibida del backend:', x)),
    tap(resp => this.catalogCache.set(key, resp))
  );
}

}
