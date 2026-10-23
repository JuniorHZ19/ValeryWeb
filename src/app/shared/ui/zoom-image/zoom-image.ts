import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';

interface Lens {
  x: number;
  y: number;
  backgroundSize: string;
  backgroundPosition: string;
}

/**
 * Image shown at its own proportions, with a square magnifier under the mouse.
 * Touch screens get the plain image: the lens only follows a real mouse pointer.
 */
@Component({
  selector: 'app-zoom-image',
  template: `
    <img
      class="img"
      [src]="src()"
      [alt]="alt()"
      (pointermove)="move($event)"
      (pointerleave)="lens.set(null)"
    />
    @if (lens(); as l) {
      <div
        class="lens"
        aria-hidden="true"
        [style.width.px]="lensSize()"
        [style.height.px]="lensSize()"
        [style.left.px]="l.x"
        [style.top.px]="l.y"
        [style.background-image]="backgroundImage()"
        [style.background-size]="l.backgroundSize"
        [style.background-position]="l.backgroundPosition"
      ></div>
    }
  `,
  styles: `
    :host { position: relative; display: block; overflow: hidden; }
    /* Full width of the container, height from the photo's own proportions: never cropped or stretched. */
    .img { display: block; width: 100%; height: auto; }
    @media (hover: hover) { .img { cursor: crosshair; } }
    .lens {
      position: absolute; translate: -50% -50%; pointer-events: none;
      border: 3px solid var(--color-surface); border-radius: 6px;
      background-color: var(--color-cream); background-repeat: no-repeat;
      box-shadow: 0 8px 24px rgb(74 47 43 / 0.35);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZoomImage {
  readonly src = input.required<string>();
  readonly alt = input('');
  /** How many times the lens enlarges the image as displayed. */
  readonly zoom = input(2.5);
  readonly lensSize = input(180);

  protected readonly lens = signal<Lens | null>(null);

  protected backgroundImage(): string {
    return `url(${JSON.stringify(this.src())})`;
  }

  protected move(event: PointerEvent): void {
    const img = event.target as HTMLImageElement;
    if (event.pointerType !== 'mouse' || !img.naturalWidth) return;

    // Where the cover-fitted image actually sits inside the box (it overflows on one axis).
    const box = img.getBoundingClientRect();
    const scale = Math.max(box.width / img.naturalWidth, box.height / img.naturalHeight);
    const width = img.naturalWidth * scale;
    const height = img.naturalHeight * scale;
    const offsetX = (box.width - width) / 2;
    const offsetY = (box.height - height) / 2;

    const x = event.clientX - box.left;
    const y = event.clientY - box.top;
    const zoom = this.zoom();
    const half = this.lensSize() / 2;

    this.lens.set({
      x,
      y,
      backgroundSize: `${width * zoom}px ${height * zoom}px`,
      backgroundPosition: `${half - (x - offsetX) * zoom}px ${half - (y - offsetY) * zoom}px`,
    });
  }
}
