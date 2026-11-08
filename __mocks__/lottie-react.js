// lottie-web reaches for a real canvas 2D context at import time, which jsdom
// does not provide, so importing the real package throws before any test runs.
// Adjacent to node_modules, so Jest applies this automatically.
const React = require('react');

const Lottie = (props) =>
  React.createElement('div', { 'data-testid': 'mock-lottie', style: props.style });

module.exports = Lottie;
module.exports.default = Lottie;
