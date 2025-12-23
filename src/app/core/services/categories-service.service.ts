import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Categories } from '../interfaces/categories.interface';
import { ApiResponse } from '../interfaces/response.interface';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  private http = inject(HttpClient);
  private baseUrl = environment.url_base;
  private getCategoryEndpoint = environment.getCategories_endpoint;

  private categoriesCache = new Map<string , ApiResponse<Categories[]>>();

  getCategories(): Observable<ApiResponse<Categories[]>>{

    const cached = this.categoriesCache.get('categoria');

    if(cached){
      return of(cached);
    }

    return this.http.get<ApiResponse<Categories[]>>(
      `${this.baseUrl}/${this.getCategoryEndpoint}`
    ) .pipe(
        tap(resp => this.categoriesCache.set('categoria' , resp))
    );
  }
}
