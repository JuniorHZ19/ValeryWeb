import { Injectable, signal } from '@angular/core';

/** One-shot success message carried across a navigation (e.g. "Producto guardado" on the list). */
@Injectable({ providedIn: 'root' })
export class AdminFlash {
  private readonly message = signal<string | null>(null);

  set(text: string): void {
    this.message.set(text);
  }

  /** Returns the pending message and clears it. */
  consume(): string | null {
    const text = this.message();
    this.message.set(null);
    return text;
  }
}
