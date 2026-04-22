import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ExampleButton } from './ExampleButton';

describe('ExampleButton', () => {
  it('renders the label', () => {
    render(<ExampleButton label="Click me" />);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('fires onClick when clicked', async () => {
    const onClick = jest.fn();
    render(<ExampleButton label="Click me" onClick={onClick} />);
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(<ExampleButton label="Click me" disabled />);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('does not fire onClick when disabled', async () => {
    const onClick = jest.fn();
    render(<ExampleButton label="Click me" disabled onClick={onClick} />);
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });
});
