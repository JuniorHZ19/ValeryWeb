import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Centered heading: small script eyebrow, display title and optional intro text. */
@Component({
  selector: 'app-section-heading',
  template: `
    @if (eyebrow()) {
      <p class="eyebrow">{{ eyebrow() }}</p>
    }
    <h2 class="title" [id]="headingId()">{{ title() }}</h2>
    @if (intro()) {
      <p class="intro">{{ intro() }}</p>
    }
  `,
  styles: `
    :host { display: block; max-width: 640px; margin: 0 auto var(--space-8); text-align: center; }
    .eyebrow { font-family: var(--font-script); font-size: var(--text-xl); color: var(--color-brick); }
    .title { font-family: var(--font-display); font-size: var(--text-2xl); font-weight: 400; color: var(--color-maroon); line-height: 1.1; }
    .intro { margin-top: var(--space-3); color: var(--color-text-muted); }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionHeading {
  readonly title = input.required<string>();
  readonly eyebrow = input<string>();
  readonly intro = input<string>();
  readonly headingId = input<string>();
}
