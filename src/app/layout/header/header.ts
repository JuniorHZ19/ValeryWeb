import { ChangeDetectionStrategy, Component, computed, ElementRef, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '@core/auth/auth.service';
import { NAV_LINKS } from '@core/config/site.config';
import { CategoryStore } from '@core/services/category.store';
import { Brand } from '@shared/ui/brand/brand';
import { Icon } from '@shared/ui/icon/icon';
import { WhatsappButton } from '@shared/ui/whatsapp-button/whatsapp-button';

/**
 * Sticky header. Links point to sections of the home page ("/#modelos"), so they also work from a
 * product page. "Categorías" opens a dropdown with one link per category. On mobile the links collapse
 * into a toggle menu.
 */
@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, Brand, Icon, WhatsappButton],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  host: {
    '(keydown.escape)': 'closeMenus()',
    '(document:click)': 'closeOnOutsideClick($event)',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  protected readonly links = NAV_LINKS;
  protected readonly categories = inject(CategoryStore).categories;
  /** Every visible product belongs to exactly one category, so the sum is the catalog size. */
  protected readonly totalProducts = computed(() => this.categories().reduce((sum, c) => sum + c.productCount, 0));
  protected readonly menuOpen = signal(false);
  protected readonly categoriesOpen = signal(false);
  /** The admin shortcut is only rendered for a signed-in admin. */
  protected readonly isAdmin = inject(AuthService).isLoggedIn;

  protected closeMenus(): void {
    this.menuOpen.set(false);
    this.categoriesOpen.set(false);
  }

  protected closeOnOutsideClick(event: MouseEvent): void {
    if (!this.host.nativeElement.contains(event.target as Node)) this.categoriesOpen.set(false);
  }
}
