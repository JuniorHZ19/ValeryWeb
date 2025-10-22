import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { SiteStore } from '@core/services/site.store';
import { Icon } from '@shared/ui/icon/icon';

/** Call-to-action that opens WhatsApp in a new tab. `variant` matches the banner styles. */
@Component({
  selector: 'app-whatsapp-button',
  imports: [Icon],
  template: `
    <a class="btn" [class]="'btn btn--' + variant()" [href]="href()" target="_blank" rel="noopener">
      <span class="btn__icon"><app-icon [name]="variant() === 'whatsapp' ? 'whatsapp' : 'arrowRight'" [size]="18" /></span>
      <ng-content />
    </a>
  `,
  styleUrl: './whatsapp-button.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WhatsappButton {
  private readonly store = inject(SiteStore);

  readonly message = input<string>();
  readonly variant = input<'maroon' | 'whatsapp' | 'light'>('maroon');

  protected readonly href = computed(() => {
    this.store.site(); // re-evaluate when the number or default message changes
    return this.store.whatsappLink(this.message());
  });
}
