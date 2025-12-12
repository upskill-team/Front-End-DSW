// Replace your-framework with the framework you are using, e.g. react-vite, nextjs, nextjs-vite, etc.
import type { Meta, StoryObj } from '@storybook/react-vite';

import Label  from './Label';

const meta = {
  component: Label,
} satisfies Meta<typeof Label>;
 
export default meta;
type Story = StoryObj<typeof meta>;
 
export const Primary: Story = {
  args: {
    children:"Label Component",
    id: "label-story"
  },
};