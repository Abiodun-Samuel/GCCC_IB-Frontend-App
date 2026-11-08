import { memo } from 'react';
import { getImage } from './homeImages';

const BASE = '/images/home';

const srcSetFor = (name, widths, ext) =>
  widths.map((w) => `${BASE}/${name}-${w}.${ext} ${w}w`).join(', ');

/**
 * Responsive image. Always emits width/height from the generated manifest so the
 * box is reserved before the bytes arrive — this is what keeps CLS at zero.
 *
 * Pass `alt=""` to mark an image decorative; anything else uses the manifest's
 * description. Exactly one image per page should get `priority`.
 */
const Picture = ({
  name,
  alt,
  sizes,
  priority = false,
  className = '',
  imgClassName = '',
  imgStyle,
}) => {
  const image = getImage(name);
  const { widths, width, height } = image;

  const decorative = alt === '';
  const resolvedAlt = decorative ? '' : (alt ?? image.alt);

  // Largest generated width is the safest single-URL fallback for browsers
  // that ignore srcSet entirely.
  const fallbackWidth = widths[widths.length - 1];

  return (
    <picture className={className}>
      <source type="image/avif" srcSet={srcSetFor(name, widths, 'avif')} sizes={sizes} />
      <source type="image/webp" srcSet={srcSetFor(name, widths, 'webp')} sizes={sizes} />
      <img
        src={`${BASE}/${name}-${fallbackWidth}.jpg`}
        srcSet={srcSetFor(name, widths, 'jpg')}
        sizes={sizes}
        alt={resolvedAlt}
        {...(decorative && { 'aria-hidden': 'true' })}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding="async"
        className={imgClassName}
        style={imgStyle}
      />
    </picture>
  );
};

export default memo(Picture);
