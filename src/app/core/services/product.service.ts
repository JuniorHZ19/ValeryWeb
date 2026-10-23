import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_ENDPOINTS } from '@core/api/api-endpoints';
import type { Product, ProductInput } from '@core/models/product.model';
import { map, type Observable } from 'rxjs';

/** Catalog endpoints of valex-api. */
@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly http = inject(HttpClient);

  /** `includeHidden` only has effect for an authenticated admin. `category` is a category slug. */
  list(includeHidden = false, category?: string): Observable<Product[]> {
    return this.http.get<Product[]>(API_ENDPOINTS.products.list, {
      params: { ...(includeHidden ? { includeHidden: true } : {}), ...(category ? { category } : {}) },
    });
  }

  getBySlug(slug: string): Observable<Product> {
    return this.http.get<Product>(API_ENDPOINTS.products.bySlug(slug));
  }

  getById(id: number): Observable<Product> {
    return this.http.get<Product>(API_ENDPOINTS.products.byId(id));
  }

  create(input: ProductInput): Observable<Product> {
    return this.http.post<Product>(API_ENDPOINTS.products.list, input);
  }

  update(id: number, input: ProductInput): Observable<Product> {
    return this.http.put<Product>(API_ENDPOINTS.products.byId(id), input);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(API_ENDPOINTS.products.byId(id));
  }

  /** Uploads an image and returns its URL. Only the URL is stored in the database, never the file. */
  uploadImage(file: File): Observable<string> {
    const body = new FormData();
    body.append('file', file);
    return this.http.post<{ url: string }>(API_ENDPOINTS.uploads, body).pipe(map((r) => r.url));
  }
}
