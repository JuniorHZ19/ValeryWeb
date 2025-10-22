import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { SiteStore } from '@core/services/site.store';
import { MediaPipe } from '@shared/pipes/media.pipe';

/** Round logo image + script wordmark. */
@Component({
  selector: 'app-brand',
  imports: [MediaPipe],
  template: `
    <img class="logo" [src]="site().logoUrl | media" alt="" width="48" height="48" />
    <span class="name">Creaciones <strong>Valery's</strong></span>
  `,
  host: { '[class.inverse]': 'inverse()' },
  styles: `
    :host { display: inline-flex; align-items: center; gap: var(--space-2); color: var(--color-brown); }
    :host(.inverse) { color: var(--color-surface); }
    .logo { width: 48px; height: 48px; border-radius: 50%; object-fit: cover; box-shadow: 0 0 0 2px var(--color-rose-soft); }
    .name { font-family: var(--font-script); font-size: 1.5rem; font-weight: 600; line-height: 1; }
    .name strong { font-weight: 700; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Brand {
  readonly inverse = input(false);
  protected readonly site = inject(SiteStore).site;
}
