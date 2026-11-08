import { memo } from 'react';

const srcSet = (path, widths, ext) => widths.map((w) => `${path}-${w}.${ext} ${w}w`).join(', ');

/**
 * A hangout photo at its own shape — never cropped. `photo` is
 * { path, alt, width, height, widths }: files are public<path>-<width>.(webp|jpg).
 * Without a photo it shows `Icon` on a tinted 3:2 tile so grids stay even.
 * `decorative` hides it from screen readers where the text next to it says it all.
 */
const HangoutPhoto = ({ photo, Icon, sizes, decorative = false, eager = false, className = '' }) => {
  if (!photo) {
    return (
      <span aria-hidden="true" className={`flex aspect-[3/2] w-full items-center justify-center bg-(--hg-tint) text-(--hg-brand) ${className}`}>
        {Icon && <Icon size={44} strokeWidth={1.6} />}
      </span>
    );
  }

  const widths = photo.widths ?? [800];
  return (
    <picture className={`block w-full ${className}`}>
      <source type="image/webp" srcSet={srcSet(photo.path, widths, 'webp')} sizes={sizes} />
      <img
        src={`${photo.path}-${widths[Math.min(1, widths.length - 1)]}.jpg`}
        srcSet={srcSet(photo.path, widths, 'jpg')}
        sizes={sizes}
        alt={decorative ? '' : photo.alt}
        {...(decorative && { 'aria-hidden': 'true' })}
        width={photo.width}
        height={photo.height}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        className="block h-auto w-full"
      />
    </picture>
  );
};

export default memo(HangoutPhoto);
