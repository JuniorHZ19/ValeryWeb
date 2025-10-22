import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { ContentItem } from '@core/models/content.model';
import { Icon } from '@shared/ui/icon/icon';
import { SectionHeading } from '@shared/ui/section-heading/section-heading';

@Component({
  selector: 'app-order-steps',
  imports: [Icon, SectionHeading],
  template: `
    <section id="como-pedir" class="section" aria-labelledby="steps-title">
      <div class="container">
        <app-section-heading
          headingId="steps-title"
          eyebrow="Así de fácil"
          title="¿Cómo pedir tu amigurumi?"
        />
        <ol class="steps">
          @for (step of steps(); track step.id; let i = $index) {
            <li class="step">
              <span class="step__number">{{ i + 1 }}</span>
              <span class="step__icon"><app-icon [name]="step.icon" [size]="28" /></span>
              <h3 class="step__title">{{ step.title }}</h3>
              <p class="step__text">{{ step.text }}</p>
            </li>
          }
        </ol>
      </div>
    </section>
  `,
  styleUrl: './order-steps.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderSteps {
  readonly steps = input.required<ContentItem[]>();
}
