import { useEffect } from 'react';
import { FONT_HREF } from './HangoutTheme';

/**
 * Adds the display font's stylesheet once, after render, on purpose: a
 * React 19 `<link precedence>` holds the whole page back until Google Fonts
 * answers, so a slow or blocked connection meant a blank page. This way the
 * page shows at once and headings swap to the font when it arrives
 * (display=swap).
 */
export const useDisplayFont = () => {
  useEffect(() => {
    if (document.querySelector(`link[href="${FONT_HREF}"]`)) return;
    const link = Object.assign(document.createElement('link'), { rel: 'stylesheet', href: FONT_HREF });
    document.head.appendChild(link);
  }, []);
};
