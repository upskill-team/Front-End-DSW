import type { Meta, StoryObj } from '@storybook/react-vite';
import DocumentViewer from '../DocumentViewer';

const meta = {
  title: 'Components/ui/DocumentViewer',
  component: DocumentViewer,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  
  argTypes: {
    onClose: { action: 'clicked' }, 
  },

} satisfies Meta<typeof DocumentViewer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    onClose: () => console.log('Cerrar presionado'),
  },
};