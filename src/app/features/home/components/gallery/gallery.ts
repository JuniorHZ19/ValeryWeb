import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { Product } from '@core/models/product.model';
import { ProductCard } from '@shared/ui/product-card/product-card';
import { SectionHeading } from '@shared/ui/section-heading/section-heading';
import { WhatsappButton } from '@shared/ui/whatsapp-button/whatsapp-button';

/** Catalog grid. Each card opens the product page. */
@Component({
  selector: 'app-gallery',
  imports: [ProductCard, SectionHeading, WhatsappButton],
  template: `
    <section id="modelos" class="container section" aria-labelledby="gallery-title">
      <app-section-heading
        headingId="gallery-title"
        eyebrow="Nuestros trabajos"
        title="Cada amigurumi es único"
        intro="Toca un modelo para ver todos sus detalles."
      />

      @if (products().length) {
        <ul class="grid">
          @for (product of products(); track product.id) {
            <li><app-product-card [product]="product" /></li>
          }
        </ul>
      } @else {
        <p class="empty">Pronto publicaremos nuevos modelos. ¡Escríbenos para pedir el tuyo!</p>
      }

      <div class="section__cta">
        <app-whatsapp-button message="¡Hola! Quiero un amigurumi personalizado como los de su galería.">
          Quiero el mío
        </app-whatsapp-button>
      </div>
    </section>
  `,
  styles: `
    :host { display: block; }
    .section { padding-block: var(--space-12); }
    .section__cta { display: flex; justify-content: center; margin-top: var(--space-8); }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: var(--space-6); }
    .empty { text-align: center; color: var(--color-text-muted); }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Gallery {
  readonly products = input.required<Product[]>();
}
