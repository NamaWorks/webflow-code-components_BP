// TestHeroCard description
// Import the raw React component, never the .webflow.tsx wrapper.

import type { Meta, StoryObj } from '@storybook/react-vite';
import { TestHeroCard } from './TestHeroCard';

const meta: Meta<typeof TestHeroCard> = {
  title: 'Components/TestHeroCard',
  component: TestHeroCard,
};

export default meta;
type Story = StoryObj<typeof TestHeroCard>;

export const Default: Story = {
  args: {
    title: 'TestHeroCard',
  },
};
