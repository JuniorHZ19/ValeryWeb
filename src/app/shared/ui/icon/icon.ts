import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type IconName =
  | 'menu'
  | 'close'
  | 'arrowRight'
  | 'heart'
  | 'hand'
  | 'sparkle'
  | 'ruler'
  | 'chat'
  | 'camera'
  | 'check'
  | 'gift'
  | 'cake'
  | 'cap'
  | 'briefcase'
  | 'tree'
  | 'pin'
  | 'tag'
  | 'chevronDown'
  | 'whatsapp'
  | 'facebook'
  | 'instagram';

/** Inline stroke icons on a 24x24 grid. Decorative unless `label` is given. */
@Component({
  selector: 'app-icon',
  templateUrl: './icon.html',
  host: { class: 'icon' },
  styles: `:host { display: inline-flex; flex-shrink: 0; }`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Icon {
  readonly name = input.required<IconName>();
  readonly size = input(24);
  readonly label = input<string>();
}
