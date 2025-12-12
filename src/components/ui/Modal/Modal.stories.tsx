import type { Meta, StoryObj } from '@storybook/react-vite';

import Modal  from './Modal';

const meta = {
  component: Modal,
} satisfies Meta<typeof Modal>;
 
export default meta;
type Story = StoryObj<typeof meta>;
 
export const Primary: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    title: "Modal Title",
    children: <div className="p-4">This is the modal content.</div>,
    size: 'lg',
    
  },
};