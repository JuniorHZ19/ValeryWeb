import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_ENDPOINTS } from '@core/api/api-endpoints';
import type { HomeContent } from '@core/models/content.model';
import type { Observable } from 'rxjs';

/** Home page blocks (highlights, steps, occasions) from valex-api. */
@Injectable({ providedIn: 'root' })
export class ContentService {
  private readonly http = inject(HttpClient);

  getHomeContent(): Observable<HomeContent> {
    return this.http.get<HomeContent>(API_ENDPOINTS.content);
  }
}
