import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@core/auth/auth.service';
import { Brand } from '@shared/ui/brand/brand';
import { describeApiError } from '../data/api-error';

@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule, RouterLink, Brand],
  template: `
    <div class="card panel">
      <app-brand class="card__brand" />
      <h1 class="page-title">Panel de administración</h1>
      <p class="card__intro">Ingresa para gestionar productos e información del sitio.</p>

      @if (error()) {
        <p class="alert alert--error" role="alert">{{ error() }}</p>
      }

      <form class="form" [formGroup]="form" (ngSubmit)="submit()">
        <label class="field">
          <span>Usuario</span>
          <input formControlName="username" autocomplete="username" />
        </label>
        <label class="field">
          <span>Contraseña</span>
          <input type="password" formControlName="password" autocomplete="current-password" />
        </label>
        <button class="btn btn--primary" type="submit" [disabled]="loading()">
          {{ loading() ? 'Ingresando...' : 'Ingresar' }}
        </button>
      </form>

      <a class="card__back" routerLink="/">← Volver al sitio</a>
    </div>
  `,
  styles: `
    :host { display: grid; place-items: center; min-height: 100dvh; padding: var(--space-4); background: var(--color-cream); }
    .card { width: min(420px, 100%); box-shadow: var(--shadow-soft); }
    .card__brand { margin-bottom: var(--space-4); }
    .card__intro { margin-block: var(--space-2) var(--space-6); color: var(--color-text-muted); }
    .card__back { display: inline-block; margin-top: var(--space-6); font-size: var(--text-sm); color: var(--color-text-muted); }
  `,
  host: { class: 'admin' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class LoginPage {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  /** Where to go after signing in (from the guard). Only /admin paths are honoured. */
  readonly returnUrl = input<string>();

  protected readonly loading = signal(false);
  protected readonly error = signal('');
  protected readonly form = inject(NonNullableFormBuilder).group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  constructor() {
    if (this.auth.isLoggedIn()) void this.router.navigateByUrl('/admin');
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.error.set('Escribe tu usuario y contraseña.');
      return;
    }
    const { username, password } = this.form.getRawValue();
    this.loading.set(true);
    this.error.set('');
    this.auth.login(username, password).subscribe({
      next: () => {
        const target = this.returnUrl();
        void this.router.navigateByUrl(target?.startsWith('/admin') ? target : '/admin');
      },
      error: (err: unknown) => {
        this.loading.set(false);
        this.error.set(describeApiError(err, 'No se pudo iniciar sesión.').title);
      },
    });
  }
}
