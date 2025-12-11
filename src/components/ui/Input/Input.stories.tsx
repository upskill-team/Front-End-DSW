import type { Meta, StoryObj } from '@storybook/react-vite';
import Input from './Input';
import { Mail, Lock, Search, User, Phone } from 'lucide-react';
import type { InputProps }  from './Input';

const iconMap = {
  None: null,
  Mail: <Mail className="w-5 h-5" />,
  Lock: <Lock className="w-5 h-5" />,
  Search: <Search className="w-5 h-5" />,
  User: <User className="w-5 h-5" />,
  Phone: <Phone className="w-5 h-5" />,
};

type IconKey = keyof typeof iconMap;

const meta = {
  title: 'Components/ui/Input',
  component: Input,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    // Map the string options to actual JSX components
    icon: {
      control: { type: 'select' },
      options: Object.keys(iconMap),
      mapping: iconMap,
      description: 'Icon displayed on the left side of the input',
    },
    type: {
      control: { type: 'select' },
      options: ['text', 'password', 'email', 'number', 'tel', 'url', 'search'],
      description: 'HTML input type',
    },
    error: {
      control: 'text',
      description: 'Error message to display below the input',
    },
    disabled: {
      control: 'boolean',
    },
  },
  // Default args shared across stories
  args: {
    className: 'w-[350px]', // Fixed width for better presentation in Storybook
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<Omit<InputProps, 'icon'> & {
  icon?: IconKey | React.ReactNode; 
}>;


// --- Stories ---

/**
 * The default text input with a label and placeholder.
 */
export const Default: Story = {
  args: {
    id: 'input-default',
    label: 'Username',
    placeholder: 'Enter your username',
    type: 'text',
    icon: 'None',
  },
};

/**
 * Input with an icon on the left side.
 * This example uses the 'Mail' icon mapping.
 */
export const WithIcon: Story = {
  args: {
    id: 'input-icon',
    label: 'Email Address',
    type: 'email',
    placeholder: 'john.doe@example.com',
    icon: 'Mail',
  },
};

/**
 * Password input with a built-in visibility toggle button.
 * The component handles the toggle logic internally.
 */
export const Password: Story = {
  args: {
    id: 'input-password',
    label: 'Password',
    type: 'password',
    placeholder: 'Enter your password',
    icon: 'Lock',
  },
};

/**
 * Input in an error state.
 * The border turns red and the error message is displayed below.
 */
export const WithError: Story = {
  args: {
    id: 'input-error',
    label: 'Email Address',
    type: 'email',
    defaultValue: 'invalid-email',
    icon: 'Mail',
    error: 'Please enter a valid email address.',
  },
};

/**
 * Search input style example.
 */
export const SearchInput: Story = {
  args: {
    id: 'input-search',
    type: 'search',
    placeholder: 'Search courses...',
    icon: 'Search'

  },
};

/**
 * Disabled state prevents user interaction and changes opacity.
 */
export const Disabled: Story = {
  args: {
    id: 'input-disabled',
    label: 'Profile URL',
    defaultValue: 'https://example.com/user/123',
    disabled: true,
    icon: 'User'
  },
};