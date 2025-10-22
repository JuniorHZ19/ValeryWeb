import type { SiteSettings } from '@core/models/site.model';

/**
 * Shown until GET /api/site answers, and kept if the API is unreachable, so the page never
 * renders empty contact data. The API (editable from /admin) is the source of truth.
 */
export const SITE_DEFAULTS: SiteSettings = {
  name: "Creaciones Valery's",
  tagline: 'Amigurumis únicos y personalizados',
  whatsappNumber: '51947191624',
  whatsappDisplay: '947 191 624',
  defaultMessage: "¡Hola Creaciones Valery's! Quiero un amigurumi personalizado.",
  facebookUrl: 'https://www.facebook.com/valerystejido',
  instagramHandle: '@valerystejido',
  instagramUrl: 'https://www.instagram.com/valerystejido/',
  location: 'San Juan de Miraflores, Lima',
  address: 'Jr. Alejandro Tirado 290, San Juan de Miraflores, Perú 15803',
  logoUrl: '/images/logo.jpg',
  heroImageUrl: '/images/dolls-group.jpg',
};

export interface NavLink {
  label: string;
  /** Anchor id inside the home page. */
  fragment: string;
}

export const NAV_LINKS: readonly NavLink[] = [
  { label: 'Inicio', fragment: 'inicio' },
  { label: 'Modelos', fragment: 'modelos' },
  { label: 'Cómo pedir', fragment: 'como-pedir' },
  { label: 'Ocasiones', fragment: 'ocasiones' },
  { label: 'Contacto', fragment: 'contacto' },
];
