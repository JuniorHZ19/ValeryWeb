import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Footer } from '@layout/footer/footer';
import { Header } from '@layout/header/header';
import { WhatsappFab } from '@layout/whatsapp-fab/whatsapp-fab';
import { filter, map } from 'rxjs';

/** Application shell. The admin panel has its own layout, so the public chrome is hidden there. */
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer, WhatsappFab],
  template: `
    @if (isAdmin()) {
      <router-outlet />
    } @else {
      <app-header />
      <main>
        <router-outlet />
      </main>
      <app-footer />
      <app-whatsapp-fab />
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly isAdmin = toSignal(
    inject(Router).events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map((e) => isAdminUrl(e.urlAfterRedirects)),
    ),
    { initialValue: isAdminUrl(inject(DOCUMENT).location.pathname) },
  );
}

function isAdminUrl(url: string): boolean {
  return url === '/admin' || url.startsWith('/admin/') || url.startsWith('/admin?');
}
