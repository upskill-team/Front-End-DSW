import type { Meta, StoryObj } from '@storybook/react-vite';
import StatusBadge  from './StatusBadge'; // Ajusta la ruta

const meta = {
  title: 'Components/ui/StatusBadge',
  component: StatusBadge,

  argTypes: {
    status: {
      control: 'radio',
      options: ['pending', 'accepted', 'rejected', 'unknown'],
      description: 'Current status to display the corresponding badge'
    },
  },
} satisfies Meta<typeof StatusBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    status: 'pending',
  },
};

export const Accepted: Story = {
  args: {
    status: 'accepted',
  },
};

export const Rejected: Story = {
  args: {
    status: 'rejected',
  },
};

export const Unknown: Story = {
  args: {
    status: 'unknown',
  },
};