import { ChangeDetectionStrategy, Component, computed, inject, input, type OnInit, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import type { Category } from '@core/models/category.model';
import type { Product, ProductInput } from '@core/models/product.model';
import { CategoryService } from '@core/services/category.service';
import { ProductService } from '@core/services/product.service';
import { ImageField } from '../components/image-field/image-field';
import { AdminFlash } from '../data/admin-flash';
import { type ApiErrorView, describeApiError } from '../data/api-error';

/** Create (/admin/productos/nuevo) and edit (/admin/productos/:id) a product. */
@Component({
  selector: 'app-product-form',
  imports: [ReactiveFormsModule, RouterLink, ImageField],
  templateUrl: './product-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ProductForm implements OnInit {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly service = inject(ProductService);
  private readonly categoryService = inject(CategoryService);
  private readonly router = inject(Router);
  private readonly flash = inject(AdminFlash);

  /** Route parameter; absent on /admin/productos/nuevo. */
  readonly id = input<string>();

  protected readonly isEdit = computed(() => !!this.id());
  protected readonly loading = signal(false);
  protected readonly saving = signal(false);
  protected readonly error = signal<ApiErrorView | null>(null);
  protected readonly slug = signal('');
  protected readonly categories = signal<Category[]>([]);

  protected readonly form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(120)]],
    categoryId: this.fb.control<number | null>(null, Validators.required),
    description: ['', Validators.maxLength(2000)],
    details: this.fb.array<string>([]),
    imageUrl: ['', Validators.required],
    imageAlt: ['', Validators.maxLength(300)],
    // Empty input = price on request.
    price: this.fb.control<number | null>(null, [Validators.min(0), Validators.max(100000)]),
    sizeInfo: ['', Validators.maxLength(200)],
    isVisible: [true],
    sortOrder: [0, [Validators.min(0), Validators.max(10000)]],
  });

  protected get details() {
    return this.form.controls.details;
  }

  ngOnInit(): void {
    this.categoryService.list().subscribe({
        next: (list) => {
          this.categories.set(list);
          // New products start in the first category; the admin can change it.
          if (!this.form.controls.categoryId.value && list.length) this.form.controls.categoryId.setValue(list[0].id);
        },
        error: (err: unknown) => this.error.set(describeApiError(err, 'No se pudieron cargar las categorías.')),
      });

    const id = Number(this.id());
    if (!this.isEdit()) {
      this.addDetail();
      return;
    }
    if (!Number.isInteger(id) || id <= 0) {
      this.error.set({ title: 'Id de producto inválido.', details: [] });
      return;
    }

    this.loading.set(true);
    this.service.getById(id).subscribe({
      next: (product) => {
        this.fill(product);
        this.loading.set(false);
      },
      error: (err: unknown) => {
        this.loading.set(false);
        this.error.set(describeApiError(err, 'No se pudo cargar el producto.'));
      },
    });
  }

  protected addDetail(value = ''): void {
    this.details.push(this.fb.control(value, Validators.maxLength(80)));
  }

  protected removeDetail(index: number): void {
    this.details.removeAt(index);
  }

  protected save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.error.set({ title: 'Revisa los campos marcados en rojo.', details: [] });
      return;
    }

    const value = this.form.getRawValue();
    const input: ProductInput = {
      ...value,
      details: value.details.map((d) => d.trim()).filter(Boolean),
      price: value.price === null || (value.price as unknown) === '' ? null : Number(value.price),
      sizeInfo: value.sizeInfo.trim() || null,
      categoryId: Number(value.categoryId),
    };

    this.saving.set(true);
    this.error.set(null);
    const request = this.isEdit() ? this.service.update(Number(this.id()), input) : this.service.create(input);
    request.subscribe({
      next: (saved) => {
        this.flash.set(`"${saved.name}" se guardó correctamente.`);
        void this.router.navigateByUrl('/admin/productos');
      },
      error: (err: unknown) => {
        this.saving.set(false);
        this.error.set(describeApiError(err, 'No se pudo guardar el producto.'));
      },
    });
  }

  protected showError(name: keyof typeof this.form.controls): boolean {
    const control = this.form.controls[name];
    return control.invalid && control.touched;
  }

  private fill(product: Product): void {
    this.slug.set(product.slug);
    this.details.clear();
    product.details.forEach((d) => this.addDetail(d));
    this.form.patchValue({
      name: product.name,
      description: product.description,
      imageUrl: product.imageUrl,
      imageAlt: product.imageAlt,
      price: product.price,
      sizeInfo: product.sizeInfo ?? '',
      isVisible: product.isVisible,
      sortOrder: product.sortOrder,
      categoryId: product.categoryId,
    });
  }
}
