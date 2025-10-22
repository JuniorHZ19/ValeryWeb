import { ChangeDetectionStrategy, Component, inject, input, model, signal } from '@angular/core';
import { ProductService } from '@core/services/product.service';
import { MediaPipe } from '@shared/pipes/media.pipe';
import { describeApiError } from '../../data/api-error';

const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_BYTES = 4 * 1024 * 1024;

/**
 * Image picker for admin forms: uploads the chosen file to the API right away and exposes the
 * resulting URL through `value` (two-way bindable: [(value)]).
 */
@Component({
  selector: 'app-image-field',
  imports: [MediaPipe],
  template: `
    <div class="image-field">
      <div class="image-field__preview">
        @if (value()) {
          <img [src]="value() | media" [alt]="'Vista previa: ' + label()" />
        } @else {
          <span>Sin imagen</span>
        }
      </div>
      <div class="image-field__side">
        <span class="image-field__label">{{ label() }}</span>
        <label class="btn btn--ghost btn--small">
          {{ uploading() ? 'Subiendo...' : value() ? 'Cambiar imagen' : 'Subir imagen' }}
          <input class="sr-only" type="file" accept="image/jpeg,image/png,image/webp" [disabled]="uploading()" (change)="onFile($event)" />
        </label>
        <small>JPG, PNG o WebP, máximo 4 MB.</small>
        @if (error()) {
          <small class="image-field__error" role="alert">{{ error() }}</small>
        }
      </div>
    </div>
  `,
  styles: `
    .image-field { display: flex; flex-wrap: wrap; align-items: center; gap: var(--space-4); }
    .image-field__preview {
      display: grid; place-items: center; width: 140px; height: 140px; overflow: hidden;
      border: 1px dashed var(--color-border); border-radius: var(--radius-md);
      background: var(--color-cream); color: var(--color-text-muted); font-size: var(--text-sm);
    }
    .image-field__preview img { width: 100%; height: 100%; object-fit: cover; }
    .image-field__side { display: grid; justify-items: start; gap: var(--space-2); }
    .image-field__label { font-size: var(--text-sm); font-weight: 700; }
    .image-field__side small { color: var(--color-text-muted); }
    .image-field__side .image-field__error { color: #b42318; }
    label.btn { cursor: pointer; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageField {
  private readonly products = inject(ProductService);

  readonly label = input('Imagen');
  readonly value = model('');

  protected readonly uploading = signal(false);
  protected readonly error = signal('');

  protected onFile(event: Event): void {
    const inputEl = event.target as HTMLInputElement;
    const file = inputEl.files?.[0];
    inputEl.value = ''; // allow choosing the same file again
    if (!file) return;

    if (!ACCEPTED.includes(file.type)) return this.error.set('Formato no soportado. Usa JPG, PNG o WebP.');
    if (file.size > MAX_BYTES) return this.error.set('La imagen supera 4 MB.');

    this.error.set('');
    this.uploading.set(true);
    this.products.uploadImage(file).subscribe({
      next: (url) => {
        this.uploading.set(false);
        this.value.set(url);
      },
      error: (err: unknown) => {
        this.uploading.set(false);
        this.error.set(describeApiError(err, 'No se pudo subir la imagen.').title);
      },
    });
  }
}
