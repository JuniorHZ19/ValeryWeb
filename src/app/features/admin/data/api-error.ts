import { HttpErrorResponse } from '@angular/common/http';

export interface ApiErrorView {
  title: string;
  details: string[];
}

/** Turns an API problem response ({ title, errors[] }) into text for the UI. */
export function describeApiError(error: unknown, fallback = 'Ocurrió un error. Inténtalo de nuevo.'): ApiErrorView {
  if (!(error instanceof HttpErrorResponse)) return { title: fallback, details: [] };
  if (error.status === 0) return { title: 'No se pudo conectar con la API. ¿Está encendida?', details: [] };

  const body = error.error as { title?: string; errors?: { field?: string; message?: string }[] } | null;
  const details = (body?.errors ?? []).map((e) => (e.field ? `${e.field}: ${e.message}` : (e.message ?? '')));
  return { title: body?.title || fallback, details };
}
