import { ChangeDetectionStrategy, Component, computed, inject, input, type OnInit, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import type { CategoryInput } from '@core/models/category.model';
import { CategoryService } from '@core/services/category.service';
import { CategoryStore } from '@core/services/category.store';
import { AdminFlash } from '../data/admin-flash';
import { type ApiErrorView, describeApiError } from '../data/api-error';

/** Create (/admin/categorias/nueva) and edit (/admin/categorias/:id) a category. */
@Component({
  selector: 'app-category-form',
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <header class="page-head">
      <h1 class="page-title">{{ isEdit() ? 'Editar categoría' : 'Nueva categoría' }}</h1>
      <a class="btn btn--ghost" routerLink="/admin/categorias">← Volver a la lista</a>
    </header>

    @if (error(); as e) {
      <div class="alert alert--error" role="alert">
        {{ e.title }}
        @if (e.details.length) {
          <ul>
            @for (d of e.details; track d) {
              <li>{{ d }}</li>
            }
          </ul>
        }
      </div>
    }

    @if (loading()) {
      <p role="status">Cargando categoría...</p>
    } @else {
      <form class="form panel" [formGroup]="form" (ngSubmit)="save()" novalidate>
        <div class="form-grid">
          <label class="field">
            <span>Nombre *</span>
            <input formControlName="name" maxlength="60" placeholder="Ej. Polos" />
            @if (showError('name')) {
              <small class="error">Escribe un nombre.</small>
            }
            @if (isEdit() && slug()) {
              <small>Dirección actual: /categorias/{{ slug() }} (cambia si cambias el nombre)</small>
            }
          </label>

          <label class="field">
            <span>Orden en el menú</span>
            <input type="number" formControlName="sortOrder" min="0" max="10000" />
            <small>Los números menores aparecen primero.</small>
          </label>
        </div>

        <label class="field">
          <span>Descripción</span>
          <textarea formControlName="description" maxlength="300" placeholder="Opcional. Se muestra arriba de los productos de la categoría."></textarea>
        </label>

        <div class="actions">
          <button class="btn btn--primary" type="submit" [disabled]="saving()">
            {{ saving() ? 'Guardando...' : isEdit() ? 'Guardar cambios' : 'Crear categoría' }}
          </button>
          <a class="btn btn--ghost" routerLink="/admin/categorias">Cancelar</a>
        </div>
      </form>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class CategoryForm implements OnInit {
  private readonly service = inject(CategoryService);
  private readonly store = inject(CategoryStore);
  private readonly router = inject(Router);
  private readonly flash = inject(AdminFlash);

  /** Route parameter; absent on /admin/categorias/nueva. */
  readonly id = input<string>();

  protected readonly isEdit = computed(() => !!this.id());
  protected readonly loading = signal(false);
  protected readonly saving = signal(false);
  protected readonly error = signal<ApiErrorView | null>(null);
  protected readonly slug = signal('');

  protected readonly form = inject(NonNullableFormBuilder).group({
    name: ['', [Validators.required, Validators.maxLength(60)]],
    description: ['', Validators.maxLength(300)],
    sortOrder: [0, [Validators.min(0), Validators.max(10000)]],
  });

  ngOnInit(): void {
    if (!this.isEdit()) return;
    const id = Number(this.id());
    if (!Number.isInteger(id) || id <= 0) {
      this.error.set({ title: 'Id de categoría inválido.', details: [] });
      return;
    }

    this.loading.set(true);
    this.service.getById(id).subscribe({
      next: (category) => {
        this.slug.set(category.slug);
        this.form.patchValue({ name: category.name, description: category.description, sortOrder: category.sortOrder });
        this.loading.set(false);
      },
      error: (err: unknown) => {
        this.loading.set(false);
        this.error.set(describeApiError(err, 'No se pudo cargar la categoría.'));
      },
    });
  }

  protected save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.error.set({ title: 'Revisa los campos marcados en rojo.', details: [] });
      return;
    }

    const value = this.form.getRawValue();
    const input: CategoryInput = { ...value, name: value.name.trim(), description: value.description.trim() };

    this.saving.set(true);
    this.error.set(null);
    const request = this.isEdit() ? this.service.update(Number(this.id()), input) : this.service.create(input);
    request.subscribe({
      next: (saved) => {
        this.store.refresh(); // the public menu shows the change right away
        this.flash.set(`"${saved.name}" se guardó correctamente.`);
        void this.router.navigateByUrl('/admin/categorias');
      },
      error: (err: unknown) => {
        this.saving.set(false);
        this.error.set(describeApiError(err, 'No se pudo guardar la categoría.'));
      },
    });
  }

  protected showError(name: keyof typeof this.form.controls): boolean {
    const control = this.form.controls[name];
    return control.invalid && control.touched;
  }
}
