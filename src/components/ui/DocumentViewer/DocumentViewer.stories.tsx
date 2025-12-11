// Replace your-framework with the framework you are using, e.g. react-vite, nextjs, nextjs-vite, etc.
import type { Meta, StoryObj } from '@storybook/react-vite';

import DocumentViewer  from '../DocumentViewer';

const meta = {
  component: DocumentViewer,
} satisfies Meta<typeof DocumentViewer>;
 
export default meta;
type Story = StoryObj<typeof meta>;
 
export const Primary: Story = {
  args: {
    label: "DocumentViewer",
    url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
  },
};