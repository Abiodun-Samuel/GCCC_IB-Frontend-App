import { render, screen } from '@testing-library/react';
import SectionHeader from '@/components/Home/shared/SectionHeader';

describe('SectionHeader', () => {
  test('renders eyebrow, both title halves and subtitle', () => {
    render(
      <SectionHeader
        eyebrow="Who We Are"
        titleLead="A Family"
        titleAccent="on Mission"
        subtitle="More than a gathering."
      />
    );

    expect(screen.getByText('Who We Are')).toBeInTheDocument();
    expect(screen.getByText(/A Family/)).toBeInTheDocument();
    expect(screen.getByText('on Mission')).toBeInTheDocument();
    expect(screen.getByText('More than a gathering.')).toBeInTheDocument();
  });

  test('the title is a level-2 heading', () => {
    render(<SectionHeader titleLead="Events" titleAccent="Coming Up" />);
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveTextContent('Events');
    expect(heading).toHaveTextContent('Coming Up');
  });

  test('omits the eyebrow and subtitle when not supplied', () => {
    const { container } = render(<SectionHeader titleLead="Just" titleAccent="Title" />);
    expect(container.querySelectorAll('p')).toHaveLength(0);
  });

  test('renders an action node when given', () => {
    render(
      <SectionHeader
        titleLead="Media"
        titleAccent="Hub"
        action={<a href="/x">View all</a>}
      />
    );
    expect(screen.getByRole('link', { name: 'View all' })).toBeInTheDocument();
  });
});
