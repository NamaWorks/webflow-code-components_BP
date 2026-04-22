// Placeholder — full stories will be added in Phase 3 (Storybook setup).
// Import the raw React component, never the .webflow.tsx wrapper.

import type { Meta, StoryObj } from '@storybook/react-vite';
import { ExampleButton } from './ExampleButton';

const meta: Meta<typeof ExampleButton> = {
  title: 'Components/ExampleButton',
  component: ExampleButton,
};

export default meta;
type Story = StoryObj<typeof ExampleButton>;

export const Default: Story = {
  args: {
    label: 'Click me',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled',
    disabled: true,
  },
};
