import type { Meta, StoryObj } from '@storybook/react-vite';

import Badge  from './Badge';

const meta = {
  component: Badge,
} satisfies Meta<typeof Badge>;
 
export default meta;
type Story = StoryObj<typeof meta>;
 
export const Primary: Story = {
  args: {
    children: 'Badge',
  },
};