import { ViewportScroller } from '@angular/common';
import { afterNextRender, ChangeDetectionStrategy, Component, effect, inject, Injector } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { startWith, Subject, switchMap } from 'rxjs';
import { ContactCta } from './components/contact-cta/contact-cta';
import { Gallery } from './components/gallery/gallery';
import { Hero } from './components/hero/hero';
import { Highlights } from './components/highlights/highlights';
import { Occasions } from './components/occasions/occasions';
import { OrderSteps } from './components/order-steps/order-steps';
import { HomeService, type HomeState } from './data/home.service';

/** Route component. Composition only; data comes from the API through HomeService. */
@Component({
  selector: 'app-home-page',
  imports: [Hero, Highlights, Gallery, OrderSteps, Occasions, ContactCta],
  templateUrl: './home-page.html',
  styles: `
    .status { padding-block: var(--space-16); text-align: center; color: var(--color-text-muted); }
    .status button { margin-top: var(--space-4); font-weight: 800; color: var(--color-maroon); text-decoration: underline; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class HomePage {
  private readonly home = inject(HomeService);
  private readonly reload$ = new Subject<void>();

  protected readonly state = toSignal(
    this.reload$.pipe(
      startWith(undefined),
      switchMap(() => this.home.load()),
    ),
    { initialValue: { status: 'loading' } as HomeState },
  );

  constructor() {
    // Sections render after the API answers, so the router's anchor scroll (e.g. coming from
    // a product page to "/#modelos") can run before they exist: scroll again once they do.
    const scroller = inject(ViewportScroller);
    const injector = inject(Injector);
    const fragment = toSignal(inject(ActivatedRoute).fragment);
    effect(() => {
      const target = fragment();
      if (this.state().status !== 'ready' || !target) return;
      afterNextRender(() => scroller.scrollToAnchor(target), { injector });
    });
  }

  protected retry(): void {
    this.reload$.next();
  }
}
