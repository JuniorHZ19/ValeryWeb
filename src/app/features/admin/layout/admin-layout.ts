import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '@core/auth/auth.service';
import { Brand } from '@shared/ui/brand/brand';
import { Icon } from '@shared/ui/icon/icon';

interface AdminLink {
  label: string;
  path: string;
  icon: 'gift' | 'pin';
}

/** Admin shell: sidebar menu (collapses to a top bar on mobile) around the admin pages. */
@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, Brand, Icon],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.scss',
  host: { class: 'admin' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminLayout {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly username = this.auth.username;
  protected readonly menuOpen = signal(false);
  protected readonly links: AdminLink[] = [
    { label: 'Productos', path: '/admin/productos', icon: 'gift' },
    { label: 'Información del sitio', path: '/admin/sitio', icon: 'pin' },
  ];

  protected logout(): void {
    this.auth.logout();
    void this.router.navigateByUrl('/admin/login');
  }
}
