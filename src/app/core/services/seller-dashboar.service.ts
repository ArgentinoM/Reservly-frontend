import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import type { ReveuneMounth, SaleMounth, Summary, TopServices } from '../interfaces/seller-dashboard.interface';

@Injectable({providedIn: 'root'})

export class DashboardService {

  private http = inject(HttpClient);
  private baseUrl =  environment.url_base;
  private dasboard_enpoint = environment.dashboard_endpoint

  private summaryCache = new Map<string, Summary>();
  private saleMounthCache = new Map<string, SaleMounth>();
  private revenueMounthCache = new Map<string, ReveuneMounth>();
  private topServicesCache = new Map<string, TopServices[]>();

  summary(): Observable<Summary> {
    const key = 'default';

    if (this.summaryCache.has(key)) {
      return of(this.summaryCache.get(key)!);
    }

    return this.http.get<Summary>(`${this.baseUrl}/${this.dasboard_enpoint}/summary`)
      .pipe(
        tap((resp) => this.summaryCache.set(key, resp))
      );
  }

  salesByMonth(): Observable<SaleMounth> {
    const key = 'default';

    if (this.saleMounthCache.has(key)) {
      return of(this.saleMounthCache.get(key)!);
    }

    return this.http.get<SaleMounth>(`${this.baseUrl}/${this.dasboard_enpoint}/sales-by-month`)
      .pipe(
        tap((resp) => this.saleMounthCache.set(key, resp))
      );
  }

  revenueByMonth(): Observable<ReveuneMounth> {
    const key = 'default';

    if (this.revenueMounthCache.has(key)) {
      return of(this.revenueMounthCache.get(key)!);
    }

    return this.http.get<ReveuneMounth>(`${this.baseUrl}/${this.dasboard_enpoint}/revenue-by-month`)
      .pipe(
        tap((resp) => this.revenueMounthCache.set(key, resp))
      );
  }

  topServices(): Observable<TopServices[]> {
    const key = 'default';

    if (this.topServicesCache.has(key)) {
      return of(this.topServicesCache.get(key)!);
    }

    return this.http.get<TopServices[]>(`${this.baseUrl}/${this.dasboard_enpoint}/top-services`)
      .pipe(
        tap((resp) => this.topServicesCache.set(key, resp))
      );
  }

}
