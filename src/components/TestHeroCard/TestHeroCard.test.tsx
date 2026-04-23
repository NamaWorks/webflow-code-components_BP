import { render, screen } from '@testing-library/react';
import { TestHeroCard } from './TestHeroCard';

describe('TestHeroCard', () => {
  it('renders without crashing', () => {
    render(<TestHeroCard title="Test" />);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  it('renders the title prop', () => {
    render(<TestHeroCard title="Hello World" />);
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });
});
