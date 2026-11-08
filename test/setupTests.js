import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

// optional: polyfills or global mocks that most tests need
// e.g. window.scrollTo for jsdom

if (!global.TextEncoder) {
  global.TextEncoder = TextEncoder;
}
if (!window.scrollTo) {
  window.scrollTo = () => {};
}

// Provide a stable timezone or locale if needed in tests
// jest.setTimeout(10000); // if you need longer timeout for slow tests

// ─── jsdom polyfills ──────────────────────────────────────────────────────────
// jsdom ships none of these. framer-motion's useReducedMotion needs matchMedia,
// useInView needs IntersectionObserver, and Gallery/Hero measure with ResizeObserver.

global.__REDUCED_MOTION__ = false;

// Query fragments a test wants matchMedia to report as matching. Everything not
// listed reports false, which is what jsdom does for real. Set it before render:
// the polyfill hands back a fresh object per call and fires no change events.
global.__MEDIA_MATCHES__ = [];

if (!window.matchMedia) {
  window.matchMedia = (query) => ({
    media: query,
    matches: query.includes('prefers-reduced-motion')
      ? global.__REDUCED_MOTION__
      : global.__MEDIA_MATCHES__.some((fragment) => query.includes(fragment)),
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  });
}

if (!global.IntersectionObserver) {
  global.IntersectionObserver = class {
    constructor(callback) {
      this.callback = callback;
    }
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return [];
    }
  };
  window.IntersectionObserver = global.IntersectionObserver;
}

if (!global.ResizeObserver) {
  global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
  window.ResizeObserver = global.ResizeObserver;
}
