import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

const AllProviders = ({ children, route = '/' }) => (
  <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
);

const customRender = (ui, options = {}) =>
  render(ui, {
    wrapper: ({ children }) => (
      <AllProviders {...options}>{children}</AllProviders>
    ),
    ...options,
  });

export * from '@testing-library/react';
export { customRender as render };

// Flips the reduced-motion media query for tests that assert both motion modes.
// Reads back through the matchMedia polyfill in setupTests.js.
export const setMatchMediaReducedMotion = (value) => {
  global.__REDUCED_MOTION__ = value;
};

// Makes matchMedia report the given query fragments as matching, for components
// that gate behaviour behind a media query (a wide viewport, a real mouse).
// Call before render, and reset with an empty array afterwards.
export const setMatchMediaQueries = (fragments = []) => {
  global.__MEDIA_MATCHES__ = fragments;
};
