import type { Meta, StoryObj } from '@storybook/react-vite';

import Select  from './Select';

const meta = {
  component: Select,
} satisfies Meta<typeof Select>;
 
export default meta;
type Story = StoryObj<typeof meta>;
 
export const Primary: Story = {
  args: {
    id: 'example-select',
    label: 'Example Select',
    children: (<>
      <option value="option1">Option 1</option>
      <option value="option2">Option 2</option>
      <option value="option3">Option 3</option>
    </>),
  },
};