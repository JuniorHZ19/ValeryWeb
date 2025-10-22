import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { SiteStore } from '@core/services/site.store';
import { Icon } from '@shared/ui/icon/icon';

/** Floating WhatsApp shortcut, always reachable while scrolling. */
@Component({
  selector: 'app-whatsapp-fab',
  imports: [Icon],
  template: `
    <a class="fab" [href]="href()" target="_blank" rel="noopener" aria-label="Escríbenos por WhatsApp">
      <app-icon name="whatsapp" [size]="30" />
    </a>
  `,
  styles: `
    .fab {
      position: fixed;
      right: var(--space-4);
      bottom: var(--space-4);
      z-index: 30;
      display: grid;
      place-items: center;
      width: 58px;
      height: 58px;
      border-radius: 50%;
      background: var(--color-whatsapp);
      color: var(--color-surface);
      box-shadow: 0 8px 24px rgb(0 0 0 / 0.25);
      transition: transform 150ms ease;
    }
    .fab:hover { transform: scale(1.08); }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WhatsappFab {
  private readonly store = inject(SiteStore);
  protected readonly href = computed(() => {
    this.store.site();
    return this.store.whatsappLink();
  });
}
