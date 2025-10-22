import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '@core/auth/auth.service';
import { NAV_LINKS } from '@core/config/site.config';
import { Brand } from '@shared/ui/brand/brand';
import { Icon } from '@shared/ui/icon/icon';
import { WhatsappButton } from '@shared/ui/whatsapp-button/whatsapp-button';

/**
 * Sticky header. Links point to sections of the home page ("/#modelos"), so they also work from a
 * product page. On mobile the links collapse into a toggle menu.
 */
@Component({
  selector: 'app-header',
  imports: [RouterLink, Brand, Icon, WhatsappButton],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  host: { '(keydown.escape)': 'menuOpen.set(false)' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {
  protected readonly links = NAV_LINKS;
  protected readonly menuOpen = signal(false);
  /** The admin shortcut is only rendered for a signed-in admin. */
  protected readonly isAdmin = inject(AuthService).isLoggedIn;
}
