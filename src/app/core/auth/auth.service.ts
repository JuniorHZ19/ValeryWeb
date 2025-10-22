import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { API_ENDPOINTS } from '@core/api/api-endpoints';
import { type Observable, tap } from 'rxjs';

interface Session {
  token: string;
  expiresAt: string;
  username: string;
}

const STORAGE_KEY = 'valex.admin.session';

/** Admin session: JWT from POST /api/auth/login, kept in localStorage until it expires. */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly session = signal<Session | null>(readSession());

  readonly username = computed(() => this.session()?.username ?? null);
  readonly isLoggedIn = computed(() => {
    const session = this.session();
    return !!session && new Date(session.expiresAt).getTime() > Date.now();
  });

  token(): string | null {
    return this.isLoggedIn() ? this.session()!.token : null;
  }

  login(username: string, password: string): Observable<Session> {
    return this.http.post<Session>(API_ENDPOINTS.auth.login, { username, password }).pipe(
      tap((session) => {
        this.session.set(session);
        writeSession(session);
      }),
    );
  }

  logout(): void {
    this.session.set(null);
    writeSession(null);
  }
}

// Storage can be unavailable (private mode, blocked site data): the session then lives in memory only.
function readSession(): Session | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}

function writeSession(session: Session | null): void {
  try {
    if (session) localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    else localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore: see readSession.
  }
}
