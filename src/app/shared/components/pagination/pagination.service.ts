import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PaginateService {

  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);

  currenPage = toSignal(
    this.activatedRoute.queryParamMap.pipe(
      map(params => +params.get('page')! || 1),
      map(page => (isNaN(page) ? 1 : page))
    ),
    { initialValue: 1 }
  );

  goToPage(page: number) {
    this.router.navigate([], {
      queryParams: { page },
      queryParamsHandling: 'merge',
    });
  }

  resetPage() {
    this.goToPage(1);
  }
}
