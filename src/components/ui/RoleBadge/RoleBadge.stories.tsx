import type { Meta, StoryObj } from '@storybook/react-vite';
import RoleBadge  from './RoleBadge';

const meta = {
  component: RoleBadge,
} satisfies Meta<typeof RoleBadge>;
 
export default meta;
type Story = StoryObj<typeof meta>;
 
export const Professor: Story = {
  args: {
    role: 'professor',
  },
};

export const Student: Story = {
  args: {
    role: 'student',
  },
};

export const Admin: Story = {
  args: {
    role: 'admin',
  },
};

