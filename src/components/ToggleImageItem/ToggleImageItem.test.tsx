import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ToggleImageItem } from './ToggleImageItem';

jest.mock('gsap', () => ({
  gsap: {
    to: jest.fn(),
    set: jest.fn(),
  },
}));

const defaultProps = {
  title: '04. Fragilidad capilar',
  content: 'Existen diferentes tipos y estadios del lipedema.',
  image: { src: 'https://example.com/image.jpg', alt: 'Test image' },
};

describe('ToggleImageItem', () => {
  it('renders without crashing', () => {
    render(<ToggleImageItem {...defaultProps} />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('renders the title in the header', () => {
    render(<ToggleImageItem {...defaultProps} />);
    expect(screen.getByText(defaultProps.title)).toBeInTheDocument();
  });

  it('content and image are always in the DOM', () => {
    render(<ToggleImageItem {...defaultProps} />);
    expect(screen.getByText(defaultProps.content)).toBeInTheDocument();
    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  it('image has the correct src', () => {
    render(<ToggleImageItem {...defaultProps} />);
    expect(screen.getByRole('img')).toHaveAttribute('src', defaultProps.image.src);
  });

  it('applies className to the root element', () => {
    const { container } = render(<ToggleImageItem {...defaultProps} className="my-toggle" />);
    expect(container.firstChild).toHaveClass('my-toggle');
  });

  describe('standalone (no className)', () => {
    it('starts closed', () => {
      render(<ToggleImageItem {...defaultProps} />);
      expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'false');
    });

    it('opens on click', async () => {
      render(<ToggleImageItem {...defaultProps} />);
      await userEvent.click(screen.getByRole('button'));
      expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'true');
    });

    it('closes again on second click', async () => {
      render(<ToggleImageItem {...defaultProps} />);
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
          <ToggleImageItem {...defaultProps} title="A" className="test-group" />
          <ToggleImageItem {...defaultProps} title="B" className="test-group" />
        </>,
      );
      const [buttonA, buttonB] = screen.getAllByRole('button');
      expect(buttonA).toHaveAttribute('aria-expanded', 'true');
      expect(buttonB).toHaveAttribute('aria-expanded', 'false');
    });

    it('closes the open item when another is clicked', async () => {
      render(
        <>
          <ToggleImageItem {...defaultProps} title="A" className="test-group" />
          <ToggleImageItem {...defaultProps} title="B" className="test-group" />
        </>,
      );
      const [buttonA, buttonB] = screen.getAllByRole('button');
      await userEvent.click(buttonB);
      expect(buttonA).toHaveAttribute('aria-expanded', 'false');
      expect(buttonB).toHaveAttribute('aria-expanded', 'true');
    });

    it('closing a non-first item re-opens the first', async () => {
      render(
        <>
          <ToggleImageItem {...defaultProps} title="A" className="test-group" />
          <ToggleImageItem {...defaultProps} title="B" className="test-group" />
        </>,
      );
      const [buttonA, buttonB] = screen.getAllByRole('button');
      await userEvent.click(buttonB);
      await userEvent.click(buttonB);
      expect(buttonB).toHaveAttribute('aria-expanded', 'false');
      expect(buttonA).toHaveAttribute('aria-expanded', 'true');
    });
  });
});
