import type { Meta, StoryObj } from '@storybook/react-vite';
import Textarea from './TextArea'; 
import { Mail, MessageSquare, PenTool, AlignLeft } from 'lucide-react';


const iconMap = {
  None: null,
  Message: <MessageSquare className="w-4 h-4" />,
  Pen: <PenTool className="w-4 h-4" />,
  Mail: <Mail className="w-4 h-4" />,
  Text: <AlignLeft className="w-4 h-4" />,
};

const meta = {
  title: 'Components/ui/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },

  argTypes: {
    icon: {
      control: { type: 'select' }, 
      options: Object.keys(iconMap), 
      mapping: iconMap, 
      description: 'Optional icon displayed within the text area',
    },

    error: {
      control: 'text',
      description: 'Error message to display invalid status',
    },
    disabled: {
      control: 'boolean',
    },
  },
  // Default arguments for all stories
  args: {
    id: 'story-textarea',
    label: 'Biografía',
    placeholder: 'Write something about yourself...',
  },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default story (Playground)
export const Default: Story = {
  args: {
   
    icon: 'None', 
  },
};

// Story with pre-selected icon
export const WithIcon: Story = {
  args: {
    label: 'Comments',
    placeholder: 'Leave your opinion...',
    icon: 'Message', 
  },
};

// Story with Error
export const WithError: Story = {
  args: {
    label: 'Description of the problem',
    icon: 'Pen',
    defaultValue: 'Text too short...',
    error: 'The description must be at least 50 characters long..',
  },
};

// History Disabled
export const Disabled: Story = {
  args: {
    label: 'Read-only area',
    icon: 'Text',
    disabled: true,
    value: 'This content cannot be edited.',
  },
};