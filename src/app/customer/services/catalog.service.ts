import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable, of, tap, catchError, throwError } from 'rxjs';
import { Catalog } from '../interfaces/response-catalog.interface';
import { PaginateResponse } from '../../core/interfaces/respose-paginate.interface';
import { ApiResponse } from '../../core/interfaces/response.interface';

interface Options {
  page?: number;
  perPage?: number;
  // category?: number;
  // price_min?: number;
  // price_max?: number;
  // duration?: number;
  // date?: string;
  // name?: string;
}

interface createOptions {
  name?: string | null,
  desc?: string | null,
  price?: number | null,
  duration?: number | null,
  img: any,
  category_id?: number | null,
}

@Injectable({
  providedIn: 'root'
})
export class CatalogService {

  private _totalServices = signal<number>(0);

  private http = inject(HttpClient);
  private baseUrl = environment.url_base;
  private getServicesEndpoint = environment.getServices_endpoint;
  private storeServicesEndpoint = environment.storeServices_endpoint;

  catalogCache = new Map<string, PaginateResponse<Catalog>>();
  private catalogIdCache = new Map<string, ApiResponse<Catalog>>();

  total = computed(() =>
    this._totalServices()
  );


  getServices(options: Options): Observable<PaginateResponse<Catalog>> {
    const {
      perPage = 20,
      page = 0,
    } = options;

    const key = `${page}-${perPage}`;

    if(this.catalogCache.has(key)){
      return of(this.catalogCache.get(key)!);
    }

    return this.http.get<PaginateResponse<Catalog>>(
      `${this.baseUrl}/${this.getServicesEndpoint}`,
      {
        params: {
          perPage,
          page,
        },
      }
    ).pipe(
      tap((resp) => this._totalServices.set(resp.meta.total)),
      tap(resp => this.catalogCache.set(key, resp))
    );
  }

  getServicesById(id: number): Observable<ApiResponse<Catalog>>{

    return this.http.get<ApiResponse<Catalog>>(`${this.baseUrl}/${this.getServicesEndpoint}/${id}`)
    .pipe(
      tap((resp) => this.catalogIdCache.set( 'service' , resp))
    )
  }

  createService(options: createOptions): Observable<ApiResponse<Catalog>>{

      const formData = new FormData();
      formData.append('name', options.name ?? '');
      formData.append('desc', options.desc ?? '');
      formData.append('price', String(options.price ?? 0));
      formData.append('duration', String(options.duration ?? 0));
      formData.append('category_id', String(options.category_id ?? 0));
      formData.append('img', options.img);

    return this.http.post<ApiResponse<Catalog>>(`${this.baseUrl}/${this.storeServicesEndpoint}`, formData).pipe(
      catchError((error) => {
      return throwError(() => ({
        message: error
      }));
      })
    )

  }

}
