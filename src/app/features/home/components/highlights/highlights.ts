import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { ContentItem } from '@core/models/content.model';
import { Icon } from '@shared/ui/icon/icon';

@Component({
  selector: 'app-highlights',
  imports: [Icon],
  template: `
    <ul class="container grid" aria-label="Por qué elegirnos">
      @for (item of items(); track item.id) {
        <li class="card">
          <span class="card__icon"><app-icon [name]="item.icon" [size]="28" /></span>
          <h2 class="card__title">{{ item.title }}</h2>
          <p class="card__text">{{ item.text }}</p>
        </li>
      }
    </ul>
  `,
  styles: `
    :host { display: block; padding-block: var(--space-16) var(--space-8); }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: var(--space-6); }
    .card { padding: var(--space-6); border-radius: var(--radius-lg); background: var(--color-cream); text-align: center; }
    .card__icon {
      display: inline-grid; place-items: center; width: 56px; height: 56px; margin-bottom: var(--space-3);
      border-radius: 50%; background: var(--color-surface); color: var(--color-brick);
    }
    .card__title { font-family: var(--font-display); font-size: var(--text-xl); font-weight: 400; color: var(--color-maroon); }
    .card__text { margin-top: var(--space-2); color: var(--color-text-muted); }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Highlights {
  readonly items = input.required<ContentItem[]>();
}
