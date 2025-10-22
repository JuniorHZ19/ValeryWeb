import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { Product } from '@core/models/product.model';
import { MediaPipe } from '@shared/pipes/media.pipe';
import { Icon } from '@shared/ui/icon/icon';

/** Clickable catalog card: photo, name, up to three details and price (or "a consultar"). */
@Component({
  selector: 'app-product-card',
  imports: [RouterLink, CurrencyPipe, MediaPipe, Icon],
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCard {
  readonly product = input.required<Product>();
}
