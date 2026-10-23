import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { Category } from '@core/models/category.model';
import { CategoryService } from '@core/services/category.service';
import { CategoryStore } from '@core/services/category.store';
import { AdminFlash } from '../data/admin-flash';
import { describeApiError } from '../data/api-error';

@Component({
  selector: 'app-category-list',
  imports: [RouterLink],
  template: `
    <header class="page-head">
      <h1 class="page-title">Categorías</h1>
      <a class="btn btn--primary" routerLink="/admin/categorias/nueva">+ Nueva categoría</a>
    </header>

    <p class="page-intro">Aparecen en el menú «Categorías» del sitio. Cada producto pertenece a una.</p>

    @if (flash()) {
      <p class="alert alert--success" role="status">{{ flash() }}</p>
    }
    @if (error()) {
      <p class="alert alert--error" role="alert">{{ error() }}</p>
    }

    @if (loading()) {
      <p role="status">Cargando categorías...</p>
    } @else if (!categories().length) {
      <div class="panel">
        <p>Aún no hay categorías. Crea la primera con «Nueva categoría».</p>
      </div>
    } @else {
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th scope="col">Nombre</th>
              <th scope="col">Productos</th>
              <th scope="col">Orden</th>
              <th scope="col"><span class="sr-only">Acciones</span></th>
            </tr>
          </thead>
          <tbody>
            @for (c of categories(); track c.id) {
              <tr>
                <td data-label="Nombre">
                  <strong>{{ c.name }}</strong>
                  <br />
                  <small>/categorias/{{ c.slug }}</small>
                </td>
                <td data-label="Productos">{{ c.productCount }}</td>
                <td data-label="Orden">{{ c.sortOrder }}</td>
                <td data-label="">
                  <div class="actions">
                    <a class="btn btn--ghost btn--small" [routerLink]="['/admin/categorias', c.id]">Editar</a>
                    <button
                      type="button"
                      class="btn btn--danger btn--small"
                      [disabled]="deletingId() === c.id"
                      [title]="c.productCount ? 'Mueve sus productos a otra categoría para poder borrarla' : ''"
                      (click)="remove(c)"
                    >
                      {{ deletingId() === c.id ? 'Borrando...' : 'Borrar' }}
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
export default class CategoryList {
  private readonly service = inject(CategoryService);
  private readonly store = inject(CategoryStore);

  protected readonly categories = signal<Category[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal('');
  protected readonly deletingId = signal<number | null>(null);
  protected readonly flash = signal(inject(AdminFlash).consume());

  constructor() {
    // Counts hidden products too: a category with only hidden products still can't be deleted.
    this.service.list(true).subscribe({
      next: (list) => {
        this.categories.set(list);
        this.loading.set(false);
      },
      error: (err: unknown) => {
        this.loading.set(false);
        this.error.set(describeApiError(err, 'No se pudieron cargar las categorías.').title);
      },
    });
  }

  protected remove(category: Category): void {
    if (category.productCount > 0) {
      this.error.set(`"${category.name}" tiene productos: muévelos a otra categoría antes de borrarla.`);
      return;
    }
    if (!confirm(`¿Borrar la categoría "${category.name}"?`)) return;

    this.deletingId.set(category.id);
    this.error.set('');
    this.service.delete(category.id).subscribe({
      next: () => {
        this.categories.update((list) => list.filter((c) => c.id !== category.id));
        this.deletingId.set(null);
        this.flash.set(`"${category.name}" fue borrada.`);
        this.store.refresh();
      },
      error: (err: unknown) => {
        this.deletingId.set(null);
        this.error.set(describeApiError(err, 'No se pudo borrar la categoría.').title);
      },
    });
  }
}
