import type { IconName } from '@shared/ui/icon/icon';

/** Mirrors ContentItemDto in the API. */
export interface ContentItem {
  id: number;
  icon: IconName;
  title: string;
  text: string;
  sortOrder: number;
}

/** Mirrors HomeContentDto in the API. */
export interface HomeContent {
  highlights: ContentItem[];
  steps: ContentItem[];
  occasions: ContentItem[];
}
