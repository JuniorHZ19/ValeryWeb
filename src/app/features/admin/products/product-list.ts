import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { Product } from '@core/models/product.model';
import { ProductService } from '@core/services/product.service';
import { MediaPipe } from '@shared/pipes/media.pipe';
import { AdminFlash } from '../data/admin-flash';
import { describeApiError } from '../data/api-error';

@Component({
  selector: 'app-product-list',
  imports: [RouterLink, CurrencyPipe, MediaPipe],
  template: `
    <header class="page-head">
      <h1 class="page-title">Productos</h1>
      <a class="btn btn--primary" routerLink="/admin/productos/nuevo">+ Nuevo producto</a>
    </header>

    @if (flash()) {
      <p class="alert alert--success" role="status">{{ flash() }}</p>
    }
    @if (error()) {
      <p class="alert alert--error" role="alert">{{ error() }}</p>
    }

    @if (loading()) {
      <p role="status">Cargando productos...</p>
    } @else if (!products().length) {
      <div class="panel">
        <p>Aún no hay productos. Crea el primero con «Nuevo producto».</p>
      </div>
    } @else {
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th scope="col">Imagen</th>
              <th scope="col">Nombre</th>
              <th scope="col">Precio</th>
              <th scope="col">Estado</th>
              <th scope="col">Orden</th>
              <th scope="col"><span class="sr-only">Acciones</span></th>
            </tr>
          </thead>
          <tbody>
            @for (p of products(); track p.id) {
              <tr>
                <td><img class="thumb" [src]="p.imageUrl | media" alt="" /></td>
                <td>
                  <strong>{{ p.name }}</strong>
                  <br />
                  <small>/productos/{{ p.slug }}</small>
                </td>
                <td>{{ p.price !== null ? (p.price | currency: 'PEN' : 'S/ ' : '1.2-2') : 'A consultar' }}</td>
                <td>
                  <span class="badge" [class.badge--on]="p.isVisible" [class.badge--off]="!p.isVisible">
                    {{ p.isVisible ? 'Visible' : 'Oculto' }}
                  </span>
                </td>
                <td>{{ p.sortOrder }}</td>
                <td>
                  <div class="actions">
                    <a class="btn btn--ghost btn--small" [routerLink]="['/admin/productos', p.id]">Editar</a>
                    <button type="button" class="btn btn--danger btn--small" [disabled]="deletingId() === p.id" (click)="remove(p)">
                      {{ deletingId() === p.id ? 'Borrando...' : 'Borrar' }}
                    </button>
                  </div>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ProductList {
  private readonly service = inject(ProductService);

  protected readonly products = signal<Product[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal('');
  protected readonly deletingId = signal<number | null>(null);
  protected readonly flash = signal(inject(AdminFlash).consume());

  constructor() {
    this.service.list(true).subscribe({
      next: (list) => {
        this.products.set(list);
        this.loading.set(false);
      },
      error: (err: unknown) => {
        this.loading.set(false);
        this.error.set(describeApiError(err, 'No se pudieron cargar los productos.').title);
      },
    });
  }

  protected remove(product: Product): void {
    if (!confirm(`¿Borrar "${product.name}"? Esta acción no se puede deshacer.`)) return;

    this.deletingId.set(product.id);
    this.error.set('');
    this.service.delete(product.id).subscribe({
      next: () => {
        this.products.update((list) => list.filter((p) => p.id !== product.id));
        this.deletingId.set(null);
        this.flash.set(`"${product.name}" fue borrado.`);
      },
      error: (err: unknown) => {
        this.deletingId.set(null);
        this.error.set(describeApiError(err, 'No se pudo borrar el producto.').title);
      },
    });
  }
}
