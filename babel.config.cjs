/**
 * Rewrites `import.meta` to a plain object.
 *
 * Vite replaces `import.meta.env` at build time. Jest runs the same source through
 * Babel in CommonJS mode, where `import.meta` is a hard syntax error — so any test
 * that transitively imports src/utils/helper.js fails to parse.
 *
 * DEV is reported as true so helper.js takes its `Date.now()` branch and never
 * reaches `__APP_VERSION__`, which Vite defines and Jest does not.
 *
 * Applied to the test environment only; the production build is untouched.
 */
const importMetaToObject = () => ({
  visitor: {
    MetaProperty(path) {
      path.replaceWithSourceString('({ env: { DEV: true, MODE: "test" } })');
    },
  },
});

module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    ['@babel/preset-react', { runtime: 'automatic' }],
  ],
  env: {
    test: {
      plugins: [importMetaToObject],
    },
  },
};
