import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../test-utils';
import CelebrationsSection from '@/components/Home/events/celebrations/CelebrationsSection';

jest.mock('@/queries/message.query', () => ({
  useSendMessage: () => ({ mutateAsync: jest.fn(), isPending: false }),
}));

const PERSON = { id: 1, first_name: 'Ada', last_name: 'Obi', date_of_birth: '1990-09-04' };

describe('CelebrationsSection', () => {
  test('renders nothing when there is nothing to celebrate', () => {
    const { container } = render(
      <CelebrationsSection birthdayList={[]} anniversaryList={[]} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  test('renders a birthday card when there are birthdays', () => {
    render(<CelebrationsSection birthdayList={[PERSON]} anniversaryList={[]} />);
    expect(screen.getByTestId('celebrations')).toBeInTheDocument();
    expect(screen.getByText(/Ada/)).toBeInTheDocument();
  });

  test('renders only the birthdays tab when there are no anniversaries', () => {
    render(<CelebrationsSection birthdayList={[PERSON]} anniversaryList={[]} />);
    expect(screen.queryByRole('tab', { name: /anniversar/i })).not.toBeInTheDocument();
  });

  test('shows both tabs when both categories have entries', () => {
    render(
      <CelebrationsSection
        birthdayList={[PERSON]}
        anniversaryList={[
          { ...PERSON, id: 2, anniversaries: [{ type: 'wedding', date: '2020-09-04' }] },
        ]}
      />
    );
    expect(screen.getByRole('tab', { name: /birthdays/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /anniversaries/i })).toBeInTheDocument();
  });

  test('the message trigger names its recipient', () => {
    render(<CelebrationsSection birthdayList={[PERSON]} anniversaryList={[]} />);
    expect(
      screen.getByRole('button', { name: /send a message to Ada Obi/i })
    ).toBeInTheDocument();
  });

  test('opens the message modal from a card', async () => {
    render(<CelebrationsSection birthdayList={[PERSON]} anniversaryList={[]} />);
    await userEvent.click(screen.getByRole('button', { name: /send a message to Ada Obi/i }));
    expect(screen.getByText(/Send Wishes to Ada Obi/i)).toBeInTheDocument();
  });
});
