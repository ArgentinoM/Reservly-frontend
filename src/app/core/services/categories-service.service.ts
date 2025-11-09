import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { ApiResponse } from '../interfaces/response.interface';
import { Categories } from '../interfaces/categories.interface';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  private http = inject(HttpClient);
  private baseUrl = environment.url_base;
  private getCategoryEndpoint = environment.getCategories_endpoint;

  private categoriesCache = new Map<string , ApiResponse<Categories[]>>();

  getCategories(): Observable<ApiResponse<Categories[]>>{
    return this.http.get<ApiResponse<Categories[]>>(
      `${this.baseUrl}/${this.getCategoryEndpoint}`
    ) .pipe(
          tap(x => console.log('Respuesta las categorias:', x)),
          tap(resp => this.categoriesCache.set('categoria' , resp))
    );
  }
}
