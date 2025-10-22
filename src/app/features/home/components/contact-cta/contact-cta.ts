import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SiteStore } from '@core/services/site.store';
import { MediaPipe } from '@shared/pipes/media.pipe';
import { Icon } from '@shared/ui/icon/icon';
import { WhatsappButton } from '@shared/ui/whatsapp-button/whatsapp-button';

/** Closing call to action. Sizes and prices are quoted by chat, so it points there. */
@Component({
  selector: 'app-contact-cta',
  imports: [MediaPipe, Icon, WhatsappButton],
  template: `
    @let s = site();
    <section id="contacto" class="cta" aria-labelledby="cta-title">
      <div class="container cta__inner">
        <img class="cta__logo" [src]="s.logoUrl | media" [alt]="'Logo de ' + s.name" width="140" height="140" loading="lazy" />
        <div class="cta__copy">
          <h2 class="cta__title" id="cta-title">¿Lista o listo para tu amigurumi?</h2>
          <p class="cta__text">Escríbenos y te contamos los tamaños y precios disponibles. Estamos en {{ s.location }}.</p>
          <div class="cta__actions">
            <app-whatsapp-button variant="light">Escríbenos al {{ s.whatsappDisplay }}</app-whatsapp-button>
            @if (s.instagramUrl) {
              <a class="cta__social" [href]="s.instagramUrl" target="_blank" rel="noopener">
                <app-icon name="instagram" [size]="20" /> {{ s.instagramHandle }}
              </a>
            }
            @if (s.facebookUrl) {
              <a class="cta__social" [href]="s.facebookUrl" target="_blank" rel="noopener">
                <app-icon name="facebook" [size]="20" /> Facebook
              </a>
            }
            @if (s.address) {
              <a class="cta__social" [href]="mapsUrl()" target="_blank" rel="noopener">
                <app-icon name="pin" [size]="20" /> Cómo llegar
              </a>
            }
          </div>
        </div>
      </div>
    </section>
  `,
  styleUrl: './contact-cta.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactCta {
  private readonly store = inject(SiteStore);
  protected readonly site = this.store.site;
  protected readonly mapsUrl = this.store.mapsUrl;
}
