/** Mirrors ProductDto in the API. */
export interface Product {
  id: number;
  slug: string;
  name: string;
  description: string;
  details: string[];
  imageUrl: string;
  imageAlt: string;
  /** null = price on request. */
  price: number | null;
  sizeInfo: string | null;
  isVisible: boolean;
  sortOrder: number;
  updatedAt: string;
}

/** Body for create/update (ProductUpsertDto). */
export type ProductInput = Omit<Product, 'id' | 'slug' | 'updatedAt'>;
