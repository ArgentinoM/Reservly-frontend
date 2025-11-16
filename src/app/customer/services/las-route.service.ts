import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LastRouteService {
  private lastUrl: string = '/';

  setUrl(url: string) {
    this.lastUrl = url;
  }

  getUrl() {
    return this.lastUrl;
  }
}
