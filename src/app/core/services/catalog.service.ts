import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Catalog } from '../../customer/interfaces/response-catalog.interface';
import { CreateOptions } from '../interfaces/CreateOptions.interfaces';
import { ApiResponse, MessageResponse } from '../interfaces/response.interface';
import { PaginateResponse } from '../interfaces/respose-paginate.interface';

interface OptionsFilter {
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
  private servicesEndpoint = environment.services_endpoint;
  catalogCache = new Map<string, PaginateResponse<Catalog>>();
  catalogByIdCache = new Map<number, Catalog>();

  total = computed(() =>
    this._totalServices()
  );

  getServices(options: OptionsFilter): Observable<PaginateResponse<Catalog>> {
    const { page = 1, perPage = 20, ...filters } = options;

    const normalizedFilters = this.normalizeFilters(filters);

    const key = JSON.stringify({
      page,
      perPage,
      ...normalizedFilters
    });

    const cached = this.catalogCache.get(key);
    if (cached) {
      return of(cached);
    }

    return this.http.get<PaginateResponse<Catalog>>(
      `${this.baseUrl}/${this.servicesEndpoint}`,
      {
        params: {
          page,
          perPage,
          ...normalizedFilters
        }
      }
    ).pipe(
      tap(resp => this._totalServices.set(resp.meta.total)),
      tap(resp => this.catalogCache.set(key, resp)),
    );
  }

  getServicesById(id: number): Observable<ApiResponse<Catalog>>{

    const cached = this.catalogByIdCache.get(id);

    if (cached) {
      return of({
        message: 'Cached',
        data: cached,
      });
    }

    return this.http.get<ApiResponse<Catalog>>(`${this.baseUrl}/${this.servicesEndpoint}/${id}`)
    .pipe(
      tap(resp => this.catalogByIdCache.set(id, resp.data))
    )
  }

  createService(options: CreateOptions): Observable<ApiResponse<Catalog>>{

      const formData = new FormData();
      formData.append('name', options.name ?? '');
      formData.append('desc', options.desc ?? '');
      formData.append('price', String(options.price ?? 0));
      formData.append('duration', String(options.duration ?? 0));
      formData.append('category_id', String(options.category_id ?? 0));
      formData.append('img', options.img);

    return this.http.post<ApiResponse<Catalog>>(`${this.baseUrl}/${this.servicesEndpoint}`, formData)
      .pipe(
        tap(resp => this.createCatalogCache(resp.data))
      );
  }

  updateService(id: number, options: Partial<CreateOptions> | FormData): Observable<ApiResponse<Catalog>> {

    return this.http.post<ApiResponse<Catalog>>(
      `${this.baseUrl}/${this.servicesEndpoint}/${id}`,
      options
    ).pipe(
      tap(resp => console.log(resp)),
      tap(resp => this.updateCatalogCache(resp.data))
    );
  }


  deleteService(id: number): Observable<MessageResponse> {
    return this.http.delete<MessageResponse>(`${this.baseUrl}/${this.servicesEndpoint}/${id}`)
      .pipe(
        tap(() => this.deleteCatalogCache(id))
      );
  }

  private createCatalogCache(catalog: Catalog) {
    const catalogId = catalog.id;

    this.catalogByIdCache.set(catalogId, catalog);

    this.catalogCache.forEach(catalogResponse => {

      catalogResponse.data = [catalog, ...catalogResponse.data];

      catalogResponse.meta.total += 1;
    });

    this._totalServices.update(v => v + 1);
  }

  private updateCatalogCache(catalog: Catalog) {

    const catalogId = catalog.id;

    this.catalogByIdCache.set(catalogId, catalog);

    this.catalogCache.forEach(catalogResponse => {

      catalogResponse.data = catalogResponse.data.map(
        (currentCatalog) =>
          currentCatalog.id === catalogId ? catalog : currentCatalog
      )

    })
  }

  private deleteCatalogCache(catalogId: number) {

    this.catalogByIdCache.delete(catalogId);

    this.catalogCache.forEach(catalogResponse => {

      catalogResponse.data = catalogResponse.data.filter(
        (currentCatalog) => currentCatalog.id !== catalogId
      )

    })
  }

  private normalizeFilters(filters: Record<string, any>): Record<string, any> {
    return Object.keys(filters)
      .sort()
      .reduce((acc, key) => {
        const value = filters[key];
        if (value !== null && value !== '' && value !== 0 && value !== undefined) {
          acc[key] = value;
        }
        return acc;
      }, {} as Record<string, any>);
  }
}
