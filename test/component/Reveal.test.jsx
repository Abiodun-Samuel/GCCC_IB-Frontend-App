import { render, screen } from '@testing-library/react';
import { setMatchMediaReducedMotion } from '../test-utils';
import Reveal from '@/components/Home/shared/Reveal';

describe('Reveal', () => {
  afterEach(() => setMatchMediaReducedMotion(false));

  test('renders its children', () => {
    render(<Reveal>hello world</Reveal>);
    expect(screen.getByText('hello world')).toBeInTheDocument();
  });

  test('renders the requested element type', () => {
    const { container } = render(<Reveal as="li">item</Reveal>);
    expect(container.querySelector('li')).toBeInTheDocument();
  });

  test('passes className through', () => {
    const { container } = render(<Reveal className="mt-4">x</Reveal>);
    expect(container.firstChild).toHaveClass('mt-4');
  });

  test('still renders children when reduced motion is on', () => {
    setMatchMediaReducedMotion(true);
    render(<Reveal>reduced</Reveal>);
    expect(screen.getByText('reduced')).toBeInTheDocument();
  });
});
