import { screen } from '@testing-library/react';
import { render } from '../test-utils';
import AboutSection from '@/components/Home/about/AboutSection';
import { ABOUT_IMAGES } from '@/components/Home/shared/homeImages';

describe('AboutSection', () => {
  test('keeps the #about anchor the header nav scrolls to', () => {
    const { container } = render(<AboutSection />);
    expect(container.querySelector('section#about')).toBeInTheDocument();
  });

  // Titles alone are ambiguous — TextPanel also uses the words Love, Family and
  // Kingdom in its heading. Assert on each card body, which is unique.
  test('renders the three value cards', () => {
    render(<AboutSection />);
    expect(screen.getByText(/Extending the love of Christ/)).toBeInTheDocument();
    expect(screen.getByText(/Close-knit believers/)).toBeInTheDocument();
    expect(screen.getByText(/Kingdom culture practiced/)).toBeInTheDocument();
  });

  test('the slide counter reports the full image count', () => {
    render(<AboutSection />);
    expect(
      screen.getByText(new RegExp(String(ABOUT_IMAGES.length).padStart(2, '0')))
    ).toBeInTheDocument();
  });

  test('renders a thumbnail strip of accessible buttons', () => {
    render(<AboutSection />);
    const thumbs = screen.getAllByRole('button');
    expect(thumbs.length).toBeGreaterThan(0);
    thumbs.forEach((b) => expect(b.getAttribute('aria-label').length).toBeGreaterThan(10));
  });

  test('sources no image from the deleted legacy folders', () => {
    const { container } = render(<AboutSection />);
    container.querySelectorAll('img, source').forEach((el) => {
      const url = el.getAttribute('src') || el.getAttribute('srcset') || '';
      expect(url).not.toMatch(/images\/home\/about\d|images\/home\/hero|images\/gallery/);
    });
  });
});
