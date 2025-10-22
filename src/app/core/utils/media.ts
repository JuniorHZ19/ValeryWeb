import { API_BASE_URL } from '@core/config/api.config';

/** Images live in the API (/images, /uploads): turn their relative paths into absolute URLs. */
export function mediaUrl(path: string | null | undefined): string {
  if (!path) return '';
  return /^(https?:|data:|blob:)/.test(path) ? path : `${API_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
}
