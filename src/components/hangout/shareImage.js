// The image a member shares after registering: the hangout card with their
// name and game written into its white band. The card itself is a rendered
// JPEG (public/images/hangout/share/share-base.jpg, 1080×1350); `flyer.jpg`
// is the same card with a general line, used if drawing fails.

import { downloadBlob } from './hangoutUtils';

export const SHARE_BASE = '/images/hangout/share/share-base.jpg';
export const SHARE_FLYER = '/images/hangout/share/flyer.jpg';
export const SHARE_SIZE = { width: 1080, height: 1350 };

// The empty band in share-base.jpg.
const BAND = { x: 64, y: 1158, w: 952, h: 144 };
const PADDING = 44;
const NAME_FONT = (px) => `800 ${px}px "Bricolage Grotesque", Outfit, sans-serif`;
const GAME_FONT = '600 34px Outfit, sans-serif';

const loadImage = (src) => new Promise((resolve, reject) => {
  const image = new Image();
  image.onload = () => resolve(image);
  image.onerror = () => reject(new Error(`Couldn't load ${src}`));
  image.src = src;
});

/** The largest font size up to `max` at which `text` fits in `width`. */
const fitFont = (ctx, text, width, max, min = 30) => {
  for (let px = max; px > min; px -= 2) {
    ctx.font = NAME_FONT(px);
    if (ctx.measureText(text).width <= width) return px;
  }
  return min;
};

/**
 * A JPEG Blob of the share card for `name` playing `game`.
 * Rejects if the browser can't draw it; callers fall back to SHARE_FLYER.
 */
export const createShareImage = async ({ name, game }) => {
  const [base] = await Promise.all([
    loadImage(SHARE_BASE),
    document.fonts?.load?.(NAME_FONT(54)).catch(() => null),
    document.fonts?.load?.(GAME_FONT).catch(() => null),
  ]);

  const canvas = document.createElement('canvas');
  canvas.width = SHARE_SIZE.width;
  canvas.height = SHARE_SIZE.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas is not available');

  ctx.drawImage(base, 0, 0, SHARE_SIZE.width, SHARE_SIZE.height);

  const left = BAND.x + PADDING;
  const textWidth = BAND.w - PADDING * 2;
  const headline = `${name} is going!`;

  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = '#0a2540';
  ctx.font = NAME_FONT(fitFont(ctx, headline, textWidth, 54));
  ctx.fillText(headline, left, BAND.y + 68, textWidth);

  ctx.fillStyle = '#0779ad';
  ctx.font = GAME_FONT;
  ctx.fillText(`Playing ${game}`, left, BAND.y + 114, textWidth);

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('Canvas export failed'))), 'image/jpeg', 0.9);
  });
};

/** A File for navigator.share, or null if this browser can't share files. */
export const shareableFile = (blob, filename) => {
  if (typeof File === 'undefined' || !navigator.canShare) return null;
  const file = new File([blob], filename, { type: blob.type || 'image/jpeg' });
  return navigator.canShare({ files: [file] }) ? file : null;
};

/**
 * Shares the card image together with `text` (the invite, which ends with
 * the hangout link) in one go, through the device's share sheet — WhatsApp,
 * status, anywhere. Browsers that can't share files (most desktops) save the
 * image and copy the text instead, for pasting alongside it.
 *
 * Resolves to 'shared', 'saved-and-copied' or 'saved'. Rejects with an
 * AbortError if the person closes the share sheet.
 */
export const shareCard = async ({ blob, filename, title, text }) => {
  const file = shareableFile(blob, filename);
  if (file) {
    await navigator.share({ files: [file], title, text });
    return 'shared';
  }
  downloadBlob(blob, filename);
  try {
    await navigator.clipboard.writeText(text);
    return 'saved-and-copied';
  } catch {
    return 'saved';
  }
};
