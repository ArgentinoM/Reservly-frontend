import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Catalog } from '../../customer/interfaces/response-catalog.interface';
import { CreateUpdateOptions } from '../interfaces/CreateUpdateOptions.interfaces';
import { ApiResponse, MessageResponse } from '../interfaces/response.interface';
import { PaginateResponse } from '../interfaces/respose-paginate.interface';

interface Options {
  page?: number;
  perPage?: number;
  category?: number;
  price_min?: number;
  price_max?: number;
  duration?: string;
  date?: string;
  name?: string;
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
  private updateServicesEndpoint = environment.updateServices_endpoint;
  private deleteServicesEndpoint = environment.deleteServices_endpoint;

  catalogCache = new Map<string, PaginateResponse<Catalog>>();
  catalogByIdCache = new Map<string, ApiResponse<Catalog>>();

  total = computed(() =>
    this._totalServices()
  );


  getServices(options: Options): Observable<PaginateResponse<Catalog>> {
    const { page = 1, perPage = 20, ...filters } = options;

    const key = JSON.stringify({ page, perPage, ...filters });

    if (this.catalogCache.has(key)) {
      return of(this.catalogCache.get(key)!);
    }

    return this.http.get<PaginateResponse<Catalog>>(
      `${this.baseUrl}/${this.getServicesEndpoint}`,
      {
        params: Object.fromEntries(
          Object.entries({
            page,
            perPage,
            ...filters,
          }).filter(([_, v]) => v !== null && v !== '' && v !== 0)
        )
      }
    ).pipe(
      tap(resp => this._totalServices.set(resp.meta.total)),
      tap(resp => this.catalogCache.set(key, resp)),
    );
}


  getServicesById(id: number): Observable<ApiResponse<Catalog>>{

    const cached = this.catalogByIdCache.get(`${id}`);

    if(cached){
      return of(cached);
    }

    return this.http.get<ApiResponse<Catalog>>(`${this.baseUrl}/${this.getServicesEndpoint}/${id}`)
    .pipe(
      tap(resp => this.catalogByIdCache.set(`${id}`, resp)),
    )
  }

  createService(options: CreateUpdateOptions): Observable<ApiResponse<Catalog>>{

      const formData = new FormData();
      formData.append('name', options.name ?? '');
      formData.append('desc', options.desc ?? '');
      formData.append('price', String(options.price ?? 0));
      formData.append('duration', String(options.duration ?? 0));
      formData.append('category_id', String(options.category_id ?? 0));
      formData.append('img', options.img);

    return this.http.post<ApiResponse<Catalog>>(`${this.baseUrl}/${this.storeServicesEndpoint}`, formData)
      .pipe(
        tap((resp) => {
          this.catalogCache.clear();
          this._totalServices.update(service => service + 1);
        })
      );

  }

  updateService(id: number, options: CreateUpdateOptions | FormData): Observable<ApiResponse<Catalog>> {

    return this.http.post<ApiResponse<Catalog>>(
      `${this.baseUrl}/${this.updateServicesEndpoint}/${id}`,
      options
    ).pipe(
      tap(resp => console.log(resp)),
      tap(() => {
        this.catalogCache.clear();
        this.catalogByIdCache.delete(`${id}`);
      })
    );
  }


  deleteService(id: number): Observable<MessageResponse> {
    return this.http.delete<MessageResponse>(`${this.baseUrl}/${this.deleteServicesEndpoint}/${id}`)
    .pipe(
      tap(() => {
        this.catalogCache.clear();
        this.catalogByIdCache.delete(`${id}`);
        this._totalServices.update(total => total - 1);
      })
    );
  }

}
