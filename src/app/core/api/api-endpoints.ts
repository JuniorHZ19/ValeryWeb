import { API_BASE_URL } from '@core/config/api.config';

/**
 * Every valex-api route in one place. Services build requests from here, so a route change in the
 * API means editing a single line.
 */
export const API_ENDPOINTS = {
  auth: {
    login: `${API_BASE_URL}/api/auth/login`,
  },
  site: `${API_BASE_URL}/api/site`,
  content: `${API_BASE_URL}/api/content`,
  products: {
    list: `${API_BASE_URL}/api/products`,
    bySlug: (slug: string) => `${API_BASE_URL}/api/products/${encodeURIComponent(slug)}`,
    byId: (id: number) => `${API_BASE_URL}/api/products/id/${id}`,
  },
  uploads: `${API_BASE_URL}/api/uploads`,
} as const;
