/** Mirrors SiteSettingsDto in the API. */
export interface SiteSettings {
  name: string;
  tagline: string;
  /** Digits only, with country code (e.g. 51947191624). */
  whatsappNumber: string;
  whatsappDisplay: string;
  defaultMessage: string;
  facebookUrl: string;
  instagramHandle: string;
  instagramUrl: string;
  location: string;
  address: string;
  /** Relative to the API (e.g. /images/logo.jpg) or absolute. */
  logoUrl: string;
  heroImageUrl: string;
}
