import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_ENDPOINTS } from '@core/api/api-endpoints';
import type { Category, CategoryInput } from '@core/models/category.model';
import type { Observable } from 'rxjs';

/** Category endpoints of valex-api. */
@Injectable({ providedIn: 'root' })
export class CategoryService {
  private readonly http = inject(HttpClient);

  /** `countHidden` (admins only) also counts hidden products in productCount. */
  list(countHidden = false): Observable<Category[]> {
    return this.http.get<Category[]>(API_ENDPOINTS.categories.list, {
      params: countHidden ? { includeHidden: true } : {},
    });
  }

  getById(id: number): Observable<Category> {
    return this.http.get<Category>(API_ENDPOINTS.categories.byId(id));
  }

  create(input: CategoryInput): Observable<Category> {
    return this.http.post<Category>(API_ENDPOINTS.categories.list, input);
  }

  update(id: number, input: CategoryInput): Observable<Category> {
    return this.http.put<Category>(API_ENDPOINTS.categories.byId(id), input);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(API_ENDPOINTS.categories.byId(id));
  }
}
