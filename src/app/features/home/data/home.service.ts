import { inject, Injectable } from '@angular/core';
import type { HomeContent } from '@core/models/content.model';
import type { Product } from '@core/models/product.model';
import { ContentService } from '@core/services/content.service';
import { ProductService } from '@core/services/product.service';
import { catchError, forkJoin, map, type Observable, of, startWith } from 'rxjs';

export type HomeState =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'ready'; content: HomeContent; products: Product[] };

/** Loads everything the home page needs from the API, as a single state stream. */
@Injectable({ providedIn: 'root' })
export class HomeService {
  private readonly content = inject(ContentService);
  private readonly products = inject(ProductService);

  load(): Observable<HomeState> {
    return forkJoin({ content: this.content.getHomeContent(), products: this.products.list() }).pipe(
      map(({ content, products }): HomeState => ({ status: 'ready', content, products })),
      catchError(() => of<HomeState>({ status: 'error' })),
      startWith<HomeState>({ status: 'loading' }),
    );
  }
}
