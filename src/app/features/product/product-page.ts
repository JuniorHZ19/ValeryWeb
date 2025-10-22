import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import type { Product } from '@core/models/product.model';
import { ProductService } from '@core/services/product.service';
import { SiteStore } from '@core/services/site.store';
import { MediaPipe } from '@shared/pipes/media.pipe';
import { Icon } from '@shared/ui/icon/icon';
import { ProductCard } from '@shared/ui/product-card/product-card';
import { WhatsappButton } from '@shared/ui/whatsapp-button/whatsapp-button';
import { catchError, map, of, startWith, switchMap } from 'rxjs';

type ProductState = { status: 'loading' } | { status: 'not-found' } | { status: 'ready'; product: Product };

/** /productos/:slug — full details of one amigurumi, with a WhatsApp CTA that names it. */
@Component({
  selector: 'app-product-page',
  imports: [RouterLink, CurrencyPipe, MediaPipe, Icon, ProductCard, WhatsappButton],
  templateUrl: './product-page.html',
  styleUrl: './product-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ProductPage {
  private readonly products = inject(ProductService);
  private readonly site = inject(SiteStore).site;

  /** Bound from the route parameter (withComponentInputBinding). */
  readonly slug = input.required<string>();

  protected readonly state = toSignal(
    toObservable(this.slug).pipe(
      switchMap((slug) =>
        this.products.getBySlug(slug).pipe(
          map((product): ProductState => ({ status: 'ready', product })),
          catchError(() => of<ProductState>({ status: 'not-found' })),
          startWith<ProductState>({ status: 'loading' }),
        ),
      ),
    ),
    { initialValue: { status: 'loading' } as ProductState },
  );

  private readonly catalog = toSignal(this.products.list().pipe(catchError(() => of<Product[]>([]))), {
    initialValue: [],
  });

  /** Up to three other models to keep browsing. */
  protected readonly others = computed(() => this.catalog().filter((p) => p.slug !== this.slug()).slice(0, 3));

  /** Previous / next product in catalog order (wraps around), for the pager under the breadcrumbs. */
  protected readonly pager = computed(() => {
    const list = this.catalog();
    const index = list.findIndex((p) => p.slug === this.slug());
    if (index < 0 || list.length < 2) return null;
    return {
      position: index + 1,
      total: list.length,
      prev: list[(index - 1 + list.length) % list.length],
      next: list[(index + 1) % list.length],
    };
  });

  protected readonly whatsappMessage = computed(() => {
    const s = this.state();
    return s.status === 'ready' ? `¡Hola! Me interesa el amigurumi "${s.product.name}". ¿Me dan más información?` : '';
  });

  constructor() {
    const title = inject(Title);
    effect(() => {
      const s = this.state();
      if (s.status === 'ready') title.setTitle(`${s.product.name} | ${this.site().name}`);
      if (s.status === 'not-found') title.setTitle(`Producto no encontrado | ${this.site().name}`);
    });
  }
}
