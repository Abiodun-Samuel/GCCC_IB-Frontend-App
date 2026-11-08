import { screen } from '@testing-library/react';
import { render } from '../test-utils';
import QuickActionsSection from '@/components/Home/quick-actions/QuickActionsSection';

describe('QuickActionsSection', () => {
  test('renders all three action cards as links', () => {
    render(<QuickActionsSection />);
    expect(screen.getByRole('link', { name: /ask anything/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /prayer request/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /testimony/i })).toBeInTheDocument();
  });

  test('each card links to its form tab', () => {
    render(<QuickActionsSection />);
    expect(screen.getByRole('link', { name: /ask anything/i })).toHaveAttribute(
      'href',
      '/forms?tab=question'
    );
  });

  test('uses the original form artwork for the ghost images', () => {
    const { container } = render(<QuickActionsSection />);
    const imgs = [...container.querySelectorAll('img')];
    expect(imgs).toHaveLength(3);
    imgs.forEach((img) => expect(img.getAttribute('src')).toMatch(/\/images\/forms\//));
  });

  test('ghost images are decorative, so they do not double-announce the card', () => {
    const { container } = render(<QuickActionsSection />);
    container.querySelectorAll('img').forEach((img) => {
      expect(img).toHaveAttribute('alt', '');
    });
  });

  test('renders the scripture quote strip', () => {
    render(<QuickActionsSection />);
    expect(screen.getByText(/John 14:13/)).toBeInTheDocument();
  });
});
