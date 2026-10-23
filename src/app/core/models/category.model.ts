/** Mirrors Category in the API. */
export interface Category {
  id: number;
  slug: string;
  name: string;
  description: string;
  sortOrder: number;
  /** Visible products in it (all of them in the admin panel). */
  productCount: number;
}

/** The category summary embedded in each product. */
export type CategoryRef = Pick<Category, 'id' | 'slug' | 'name'>;

/** Body for create/update. The API derives the slug from the name. */
export type CategoryInput = Pick<Category, 'name' | 'description' | 'sortOrder'>;
