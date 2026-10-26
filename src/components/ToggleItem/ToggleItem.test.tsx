import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ToggleItem } from './ToggleItem';

jest.mock('gsap', () => ({
  gsap: {
    to: jest.fn(),
    set: jest.fn(),
  },
}));

const defaultProps = {
  title: '04. Fragilidad capilar',
  content: 'Existen diferentes tipos y estadios del lipedema.',
};

describe('ToggleItem', () => {
  it('renders without crashing', () => {
    render(<ToggleItem {...defaultProps} />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('renders the title in the header', () => {
    render(<ToggleItem {...defaultProps} />);
    expect(screen.getByText(defaultProps.title)).toBeInTheDocument();
  });

  it('content is always in the DOM', () => {
    render(<ToggleItem {...defaultProps} />);
    expect(screen.getByText(defaultProps.content)).toBeInTheDocument();
  });

  it('applies className to the root element', () => {
    const { container } = render(<ToggleItem {...defaultProps} className="my-toggle" />);
    expect(container.firstChild).toHaveClass('my-toggle');
  });

  describe('standalone (no className)', () => {
    it('starts closed', () => {
      render(<ToggleItem {...defaultProps} />);
      expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'false');
    });

    it('opens on click', async () => {
      render(<ToggleItem {...defaultProps} />);
      await userEvent.click(screen.getByRole('button'));
      expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'true');
    });

    it('closes again on second click', async () => {
      render(<ToggleItem {...defaultProps} />);
      const button = screen.getByRole('button');
      await userEvent.click(button);
      await userEvent.click(button);
      expect(button).toHaveAttribute('aria-expanded', 'false');
    });
  });

  describe('grouped (shared className)', () => {
    it('auto-opens the first item on mount', () => {
      render(
        <>
          <ToggleItem title="A" content="content A" className="test-group" />
          <ToggleItem title="B" content="content B" className="test-group" />
        </>,
      );
      const [buttonA, buttonB] = screen.getAllByRole('button');
      expect(buttonA).toHaveAttribute('aria-expanded', 'true');
      expect(buttonB).toHaveAttribute('aria-expanded', 'false');
    });

    it('closes the open item when another is clicked', async () => {
      render(
        <>
          <ToggleItem title="A" content="content A" className="test-group" />
          <ToggleItem title="B" content="content B" className="test-group" />
        </>,
      );
      const [buttonA, buttonB] = screen.getAllByRole('button');
      await userEvent.click(buttonB);
      expect(buttonA).toHaveAttribute('aria-expanded', 'false');
      expect(buttonB).toHaveAttribute('aria-expanded', 'true');
    });

    it('does nothing when the first (fallback) item is clicked while open', async () => {
      render(
        <>
          <ToggleItem title="A" content="content A" className="test-group" />
          <ToggleItem title="B" content="content B" className="test-group" />
        </>,
      );
      const [buttonA] = screen.getAllByRole('button');
      await userEvent.click(buttonA);
      expect(buttonA).toHaveAttribute('aria-expanded', 'true');
    });

    it('closing a non-first item re-opens the first item', async () => {
      render(
        <>
          <ToggleItem title="A" content="content A" className="test-group" />
          <ToggleItem title="B" content="content B" className="test-group" />
        </>,
      );
      const [buttonA, buttonB] = screen.getAllByRole('button');
      await userEvent.click(buttonB); // open B (closes A)
      expect(buttonB).toHaveAttribute('aria-expanded', 'true');
      await userEvent.click(buttonB); // close B — should re-open A
      expect(buttonB).toHaveAttribute('aria-expanded', 'false');
      expect(buttonA).toHaveAttribute('aria-expanded', 'true');
    });
  });
});
