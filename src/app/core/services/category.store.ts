import { inject, Injectable, signal } from '@angular/core';
import type { Category } from '@core/models/category.model';
import { CategoryService } from './category.service';

/** Categories for the public menu and category pages. Loaded once; admin edits call refresh(). */
@Injectable({ providedIn: 'root' })
export class CategoryStore {
  private readonly service = inject(CategoryService);
  private readonly state = signal<Category[]>([]);
  private readonly loadedState = signal(false);

  readonly categories = this.state.asReadonly();
  /** True once the API answered (or failed), so pages can tell "still loading" from "doesn't exist". */
  readonly loaded = this.loadedState.asReadonly();

  constructor() {
    this.refresh();
  }

  refresh(): void {
    // On failure the menu just stays empty: the rest of the site keeps working.
    this.service.list().subscribe({
      next: (list) => {
        this.state.set(list);
        this.loadedState.set(true);
      },
      error: () => this.loadedState.set(true),
    });
  }
}
