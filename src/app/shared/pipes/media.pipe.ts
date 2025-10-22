import { Pipe, type PipeTransform } from '@angular/core';
import { mediaUrl } from '@core/utils/media';

/** `{{ product.imageUrl | media }}` → absolute URL served by the API. */
@Pipe({ name: 'media' })
export class MediaPipe implements PipeTransform {
  transform(path: string | null | undefined): string {
    return mediaUrl(path);
  }
}
