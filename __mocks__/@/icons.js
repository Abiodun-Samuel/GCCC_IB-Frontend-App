// Shared stub for the project icon set.
//
// Jest auto-applies this for every `@/icons` import, so a hand-written list of
// named exports silently resolves every unlisted icon to `undefined` — which
// surfaces far away as "Element type is invalid". A Proxy stubs any icon name,
// so adding an icon to src/icons never breaks a test again.
const React = require('react');

const makeIcon = (name) => {
  const Icon = (props) =>
    React.createElement('svg', {
      'data-testid': `mock-icon-${name}`,
      'aria-hidden': 'true',
      ...props,
    });
  Icon.displayName = `MockIcon(${name})`;
  return Icon;
};

const cache = new Map();

// LoadingIcon2 keeps its historical testid — existing tests assert on it.
cache.set('LoadingIcon2', (props) =>
  React.createElement('svg', { 'data-testid': 'mock-loading-icon', ...props })
);

module.exports = new Proxy(
  {},
  {
    get(_target, prop) {
      if (prop === '__esModule') return true;
      if (typeof prop !== 'string') return undefined;
      if (!cache.has(prop)) cache.set(prop, makeIcon(prop));
      return cache.get(prop);
    },
    has: () => true,
    ownKeys: () => [...cache.keys()],
    getOwnPropertyDescriptor: () => ({ enumerable: true, configurable: true }),
  }
);
