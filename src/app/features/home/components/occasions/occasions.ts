import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { ContentItem } from '@core/models/content.model';
import { Icon } from '@shared/ui/icon/icon';
import { SectionHeading } from '@shared/ui/section-heading/section-heading';

@Component({
  selector: 'app-occasions',
  imports: [Icon, SectionHeading],
  template: `
    <section id="ocasiones" class="container section" aria-labelledby="occasions-title">
      <app-section-heading
        headingId="occasions-title"
        eyebrow="Para cada momento"
        title="Un regalo que nunca olvidarán"
      />
      <ul class="chips">
        @for (occasion of occasions(); track occasion.id) {
          <li class="chip"><app-icon [name]="occasion.icon" [size]="22" /> {{ occasion.title }}</li>
        }
      </ul>
    </section>
  `,
  styles: `
    :host { display: block; }
    .section { padding-block: var(--space-12); }
    .chips { display: flex; flex-wrap: wrap; justify-content: center; gap: var(--space-3); }
    .chip {
      display: inline-flex; align-items: center; gap: var(--space-2);
      padding: var(--space-3) var(--space-6); border: 2px solid var(--color-rose-soft);
      border-radius: var(--radius-pill); font-weight: 700; color: var(--color-maroon);
    }
    .chip app-icon { color: var(--color-rose); }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Occasions {
  readonly occasions = input.required<ContentItem[]>();
}
