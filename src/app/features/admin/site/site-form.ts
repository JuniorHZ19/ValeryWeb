import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SiteStore } from '@core/services/site.store';
import { ImageField } from '../components/image-field/image-field';
import { type ApiErrorView, describeApiError } from '../data/api-error';

const URL_PATTERN = /^(https?:\/\/\S+)?$/;

/** Business information shown across the public site (contact, social links, logo, hero image). */
@Component({
  selector: 'app-site-form',
  imports: [ReactiveFormsModule, ImageField],
  templateUrl: './site-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class SiteForm {
  private readonly store = inject(SiteStore);

  protected readonly loading = signal(true);
  protected readonly saving = signal(false);
  protected readonly saved = signal(false);
  protected readonly error = signal<ApiErrorView | null>(null);

  protected readonly form = inject(NonNullableFormBuilder).group({
    name: ['', [Validators.required, Validators.maxLength(80)]],
    tagline: ['', Validators.maxLength(160)],
    whatsappNumber: ['', [Validators.required, Validators.pattern(/^\d{8,15}$/)]],
    whatsappDisplay: ['', [Validators.required, Validators.maxLength(30)]],
    defaultMessage: ['', Validators.maxLength(300)],
    facebookUrl: ['', Validators.pattern(URL_PATTERN)],
    instagramHandle: ['', Validators.maxLength(60)],
    instagramUrl: ['', Validators.pattern(URL_PATTERN)],
    location: ['', Validators.maxLength(120)],
    address: ['', Validators.maxLength(200)],
    logoUrl: ['', Validators.required],
    heroImageUrl: ['', Validators.required],
  });

  constructor() {
    this.store.refresh().subscribe({
      next: (site) => {
        this.form.patchValue(site);
        this.loading.set(false);
      },
      error: (err: unknown) => {
        this.loading.set(false);
        this.error.set(describeApiError(err, 'No se pudo cargar la información.'));
      },
    });
    // Hide the "saved" banner as soon as something changes again.
    this.form.valueChanges.subscribe(() => this.saved.set(false));
  }

  protected save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.error.set({ title: 'Revisa los campos marcados en rojo.', details: [] });
      return;
    }
    this.saving.set(true);
    this.error.set(null);
    this.store.update(this.form.getRawValue()).subscribe({
      next: () => {
        this.saving.set(false);
        this.saved.set(true);
      },
      error: (err: unknown) => {
        this.saving.set(false);
        this.error.set(describeApiError(err, 'No se pudo guardar la información.'));
      },
    });
  }

  protected showError(name: keyof typeof this.form.controls): boolean {
    const control = this.form.controls[name];
    return control.invalid && control.touched;
  }
}
