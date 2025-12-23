import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { catchError, map, Observable, of, shareReplay } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CatalogService } from '../../core/services/catalog.service';
import { AuthResponse } from '../interfaces/auth-response';
import { User } from '../interfaces/user';

type AuthStatus = 'checking' | 'authenticated' | 'not-authenticated'
const baseUrl = environment.url_base;
const loginEndpoint =  environment.login_endpoint;
const registerEndpoint =  environment.register_endpoint;
const verifyEndpoint =  environment.verifyCode_endpoint;
const logoutEndpoint =  environment.logout_endpoint;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _authStatus = signal<AuthStatus>('checking');
  private _user = signal<User | null>(null);
  private _token = signal<string | null>(localStorage.getItem('token'));
  private http = inject(HttpClient);
  private catalogService = inject(CatalogService);
  private _checkStatusCache: { value: boolean; expiresAt: number } | null = null;
  private readonly CACHE_DURATION = 60 * 60 * 1000;



  private caches = new Set<Map<any, any>>();

  checkStatusResource = rxResource({
    loader: () => this.checkStatus(),
  });

  authStatus = computed<AuthStatus>(() => {
    if (this._authStatus() === 'checking') return 'checking';

    if (this._user()) {
      return 'authenticated';
    }

    return 'not-authenticated';
  });

  user = computed(() => this._user());
  token = computed(this._token);
  roles = computed(() => this._user()?.rol);

  isLoggedInLocal(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  }

  register(data: any): Observable<boolean> {
    return this.http.post(`${baseUrl}/${registerEndpoint}`, data).pipe(
      map(() => true),
    );
  }

  login(email: string, password: string): Observable<boolean> {
    return this.http
      .post<AuthResponse>(`${baseUrl}/${loginEndpoint}`, {
        email: email,
        password: password,
      })
      .pipe(
        map((resp) => this.handleAuthSuccess(resp)),
        catchError((error: any) => this.handleAuthError(error))
      );
  }

  checkStatus(): Observable<boolean> {
    const now = Date.now();

    if (this._checkStatusCache && this._checkStatusCache.expiresAt > now) {
      return of(this._checkStatusCache.value);
    }

    const token = localStorage.getItem('token');
    if (!token) {
      this.logout();
      return of(false);
    }

    return this.http.get<AuthResponse>(`${baseUrl}/${verifyEndpoint}`).pipe(
      map((resp) => {
        const success = this.handleAuthSuccess(resp);
        this._checkStatusCache = {
          value: success,
          expiresAt: now + this.CACHE_DURATION,
        };
        return success;
      }),
      catchError((error: any) => {
        this.handleAuthError(error);
        this._checkStatusCache = { value: false, expiresAt: now + this.CACHE_DURATION };
        return of(false);
      }),
      shareReplay(1)
    );
  }


  logout() {
    return this.http.get(`${baseUrl}/${logoutEndpoint}`).pipe(
      map(() => {
        this._user.set(null);
        this._token.set(null);
        this._authStatus.set('not-authenticated');
        this.clearCache();
        this._checkStatusCache = null;
        localStorage.removeItem('token');
      })
    );
  }


  private clearCache(){
    this.catalogService.catalogCache.clear();
  }

  private handleAuthSuccess({ token, data }: AuthResponse) {
    this._user.set(data);
    this._authStatus.set('authenticated');
    this._token.set(token);

    localStorage.setItem('token', token);

    return true;
  }

  private handleAuthError(error: any) {
    this.logout();

    return of(false);
  }
}
