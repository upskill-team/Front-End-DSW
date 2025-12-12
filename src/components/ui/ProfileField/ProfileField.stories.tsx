import type { Meta, StoryObj } from '@storybook/react-vite';

import ProfileField  from './ProfileField';

const meta = {
  component: ProfileField,
} satisfies Meta<typeof ProfileField>;
 
export default meta;
type Story = StoryObj<typeof meta>;
 
export const Primary: Story = {
  args: {
    isEditing: false,
    label: "User Name",
    value: "",
    icon: <span>👤</span>,

  },
};