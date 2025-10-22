import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NAV_LINKS } from '@core/config/site.config';
import { SiteStore } from '@core/services/site.store';
import { Brand } from '@shared/ui/brand/brand';
import { Icon } from '@shared/ui/icon/icon';

@Component({
  selector: 'app-footer',
  imports: [RouterLink, Brand, Icon],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Footer {
  private readonly store = inject(SiteStore);

  protected readonly site = this.store.site;
  protected readonly mapsUrl = this.store.mapsUrl;
  protected readonly whatsappHref = computed(() => {
    this.site();
    return this.store.whatsappLink();
  });
  protected readonly links = NAV_LINKS;
  protected readonly year = new Date().getFullYear();
}
