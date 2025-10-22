import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { API_ENDPOINTS } from '@core/api/api-endpoints';
import { SITE_DEFAULTS } from '@core/config/site.config';
import type { SiteSettings } from '@core/models/site.model';
import { mapsUrl, whatsappUrl } from '@core/utils/whatsapp';
import type { Observable } from 'rxjs';
import { tap } from 'rxjs';

/** Business information shared by every page. Loaded once; admin edits update it in place. */
@Injectable({ providedIn: 'root' })
export class SiteStore {
  private readonly http = inject(HttpClient);
  private readonly url = API_ENDPOINTS.site;
  private readonly state = signal<SiteSettings>(SITE_DEFAULTS);

  readonly site = this.state.asReadonly();
  readonly mapsUrl = computed(() => mapsUrl(this.site().address));

  constructor() {
    // On failure the defaults stay in place: the public page keeps working without the API.
    this.http.get<SiteSettings>(this.url).subscribe({ next: (site) => this.state.set(site), error: () => {} });
  }

  /** Fresh copy from the API (the admin form starts from it, not from possibly stale state). */
  refresh(): Observable<SiteSettings> {
    return this.http.get<SiteSettings>(this.url).pipe(tap((site) => this.state.set(site)));
  }

  whatsappLink(message?: string): string {
    const site = this.site();
    return whatsappUrl(site.whatsappNumber, message || site.defaultMessage);
  }

  update(changes: SiteSettings): Observable<SiteSettings> {
    return this.http.put<SiteSettings>(this.url, changes).pipe(tap((site) => this.state.set(site)));
  }
}
