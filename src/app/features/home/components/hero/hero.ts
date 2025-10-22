import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SiteStore } from '@core/services/site.store';
import { MediaPipe } from '@shared/pipes/media.pipe';
import { Icon } from '@shared/ui/icon/icon';
import { WhatsappButton } from '@shared/ui/whatsapp-button/whatsapp-button';

/** Banner recreated in HTML/CSS: headline, CTA, "hecho a mano" badge, dolls photo and contact strip. */
@Component({
  selector: 'app-hero',
  imports: [RouterLink, MediaPipe, Icon, WhatsappButton],
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Hero {
  private readonly store = inject(SiteStore);
  protected readonly site = this.store.site;
  protected readonly whatsappHref = computed(() => {
    this.site();
    return this.store.whatsappLink();
  });
}
