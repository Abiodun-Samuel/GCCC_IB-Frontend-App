import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../test-utils';
import Lightbox from '@/components/Home/gallery/Lightbox';

const IMAGES = ['neon-trio-joy', 'worship-lead', 'congregation-wide'];

const setup = (index = 1) => {
  const onClose = jest.fn();
  const onNavigate = jest.fn();
  render(
    <Lightbox images={IMAGES} index={index} onClose={onClose} onNavigate={onNavigate} />
  );
  return { onClose, onNavigate };
};

describe('Lightbox', () => {
  test('is an accessible modal dialog', () => {
    setup();
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
  });

  test('shows the image at the given index', () => {
    setup(1);
    expect(
      screen.getByAltText(/worship leader singing into a microphone/i)
    ).toBeInTheDocument();
  });

  test('Escape closes it', async () => {
    const { onClose } = setup();
    await userEvent.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test('arrow keys navigate', async () => {
    const { onNavigate } = setup(1);
    await userEvent.keyboard('{ArrowRight}');
    expect(onNavigate).toHaveBeenCalledWith(2);

    await userEvent.keyboard('{ArrowLeft}');
    expect(onNavigate).toHaveBeenCalledWith(0);
  });

  test('navigation wraps at both ends', async () => {
    const { onNavigate } = setup(IMAGES.length - 1);
    await userEvent.keyboard('{ArrowRight}');
    expect(onNavigate).toHaveBeenCalledWith(0);
  });

  test('moves focus into the dialog on open', () => {
    setup();
    expect(screen.getByRole('dialog').contains(document.activeElement)).toBe(true);
  });

  test('the close control has an accessible name', () => {
    setup();
    expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument();
  });

  test('locks background scroll while open and restores it on unmount', () => {
    const { unmount } = render(
      <Lightbox images={IMAGES} index={0} onClose={() => {}} onNavigate={() => {}} />
    );
    expect(document.body.style.overflow).toBe('hidden');
    unmount();
    expect(document.body.style.overflow).not.toBe('hidden');
  });
});
