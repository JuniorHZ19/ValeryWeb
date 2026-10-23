import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Title } from '@angular/platform-browser';
import { RouterLink, RouterLinkActive } from '@angular/router';
import type { Product } from '@core/models/product.model';
import { CategoryStore } from '@core/services/category.store';
import { ProductService } from '@core/services/product.service';
import { SiteStore } from '@core/services/site.store';
import { ProductCard } from '@shared/ui/product-card/product-card';
import { WhatsappButton } from '@shared/ui/whatsapp-button/whatsapp-button';
import { catchError, map, of, startWith, switchMap } from 'rxjs';

type ProductsState = { status: 'loading' } | { status: 'error' } | { status: 'ready'; products: Product[] };

/** /categorias/:slug — the visible products of one category, with links to the other categories. */
@Component({
  selector: 'app-category-page',
  imports: [RouterLink, RouterLinkActive, ProductCard, WhatsappButton],
  template: `
    <div class="container page">
      <nav class="crumbs" aria-label="Ruta de navegación">
        <a routerLink="/">Inicio</a>
        <span aria-hidden="true">/</span>
        <span>Categorías</span>
        @if (category(); as c) {
          <span aria-hidden="true">/</span>
          <span aria-current="page">{{ c.name }}</span>
        }
      </nav>

      @if (notFound()) {
        <div class="status" role="alert">
          <h1 class="title">No encontramos esta categoría</h1>
          <p>Puede que ya no exista. Mira todos nuestros productos.</p>
          <a class="status__link" routerLink="/" fragment="modelos">Ver todos los productos</a>
        </div>
      } @else {
        <header class="head">
          <p class="eyebrow">Categoría</p>
          <h1 class="title">{{ category()?.name ?? 'Cargando...' }}</h1>
          @if (category()?.description) {
            <p class="intro">{{ category()?.description }}</p>
          }
        </header>

        @if (categories().length > 1) {
          <nav class="chips" aria-label="Otras categorías">
            @for (c of categories(); track c.id) {
              <a class="chip" [routerLink]="['/categorias', c.slug]" routerLinkActive="chip--active" ariaCurrentWhenActive="page">
                {{ c.name }}
              </a>
            }
          </nav>
        }

        @let s = state();
        @if (s.status === 'loading') {
          <p class="status" role="status">Cargando productos...</p>
        } @else if (s.status === 'error') {
          <p class="status" role="alert">No pudimos cargar los productos en este momento.</p>
        } @else if (s.products.length) {
          <ul class="grid">
            @for (product of s.products; track product.id) {
              <li><app-product-card [product]="product" /></li>
            }
          </ul>
        } @else {
          <div class="status">
            <p>Pronto publicaremos productos en esta categoría. ¡Escríbenos para pedir el tuyo!</p>
          </div>
        }

        <div class="cta">
          <app-whatsapp-button [message]="whatsappMessage()">Consultar por WhatsApp</app-whatsapp-button>
        </div>
      }
    </div>
  `,
  styles: `
    :host { display: block; }
    .page { padding-block: var(--space-6) var(--space-16); }
    .crumbs { display: flex; flex-wrap: wrap; gap: var(--space-2); margin-bottom: var(--space-6); font-size: var(--text-sm); color: var(--color-text-muted); }
    .crumbs a:hover { color: var(--color-maroon); text-decoration: underline; }
    .crumbs [aria-current] { font-weight: 700; color: var(--color-text); }
    .head { max-width: 640px; margin: 0 auto var(--space-6); text-align: center; }
    .eyebrow { font-family: var(--font-script); font-size: var(--text-xl); color: var(--color-brick); }
    .title { font-family: var(--font-display); font-size: var(--text-2xl); font-weight: 400; line-height: 1.1; color: var(--color-maroon); }
    .intro { margin-top: var(--space-3); color: var(--color-text-muted); }
    .chips { display: flex; flex-wrap: wrap; justify-content: center; gap: var(--space-2); margin-bottom: var(--space-8); }
    .chip {
      padding: var(--space-2) var(--space-4); border: 2px solid var(--color-rose-soft); border-radius: var(--radius-pill);
      font-weight: 700; color: var(--color-maroon);
    }
    .chip:hover { background: var(--color-cream); }
    .chip--active { border-color: var(--color-maroon); background: var(--color-maroon); color: var(--color-surface); }
    .chip--active:hover { background: var(--color-maroon); }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: var(--space-6); }
    .status { padding-block: var(--space-12); text-align: center; color: var(--color-text-muted); }
    .status__link { display: inline-block; margin-top: var(--space-4); font-weight: 800; color: var(--color-maroon); text-decoration: underline; }
    .cta { display: flex; justify-content: center; margin-top: var(--space-8); }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class CategoryPage {
  private readonly store = inject(CategoryStore);
  private readonly products = inject(ProductService);
  private readonly site = inject(SiteStore).site;

  /** Bound from the route parameter (withComponentInputBinding). */
  readonly slug = input.required<string>();

  protected readonly categories = this.store.categories;
  protected readonly category = computed(() => this.categories().find((c) => c.slug === this.slug()) ?? null);
  protected readonly notFound = computed(() => this.store.loaded() && !this.category());

  protected readonly state = toSignal(
    toObservable(this.slug).pipe(
      switchMap((slug) =>
        this.products.list(false, slug).pipe(
          map((products): ProductsState => ({ status: 'ready', products })),
          catchError(() => of<ProductsState>({ status: 'error' })),
          startWith<ProductsState>({ status: 'loading' }),
        ),
      ),
    ),
    { initialValue: { status: 'loading' } as ProductsState },
  );

  protected readonly whatsappMessage = computed(() => {
    const name = this.category()?.name;
    return name ? `¡Hola! Quiero información sobre sus productos de ${name}.` : '';
  });

  constructor() {
    const title = inject(Title);
    effect(() => {
      const category = this.category();
      if (category) title.setTitle(`${category.name} | ${this.site().name}`);
      else if (this.notFound()) title.setTitle(`Categoría no encontrada | ${this.site().name}`);
    });
  }
}
