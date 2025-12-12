import type { Meta, StoryObj } from '@storybook/react-vite';
import { Avatar, AvatarImage, AvatarFallback } from './Avatar';

/**
 * We define a custom type that includes props for the root Avatar component
 * plus the props we want to control for the children (Image and Fallback).
 */
type AvatarStoryProps = React.ComponentProps<typeof Avatar> & {
  src?: string;
  alt?: string;
  fallbackText?: string;
};

const meta = {
  title: 'Components/ui/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    src: {
      control: 'text',
      description: 'URL of the avatar image (passed to AvatarImage)',
    },
    alt: {
      control: 'text',
      description: 'Alt text for the image (passed to AvatarImage)',
    },
    fallbackText: {
      control: 'text',
      description: 'Text/Initials shown when image fails or is loading (passed to AvatarFallback)',
    },
    className: {
      control: 'text',
      description: 'Classes to adjust size or styling of the root container',
    },
  },
  // Default arguments for all stories
  args: {
    src: 'https://github.com/shadcn.png',
    alt: '@shadcn',
    fallbackText: 'CN',
  },

  render: ({ src, alt, fallbackText, ...args }) => (
    <Avatar {...args}>
      <AvatarImage src={src} alt={alt} />
      <AvatarFallback>{fallbackText}</AvatarFallback>
    </Avatar>
  ),
} satisfies Meta<AvatarStoryProps>;

export default meta;
type Story = StoryObj<AvatarStoryProps>;

/**
 * **Default:**
 * Displays the image successfully.
 */
export const Default: Story = {};

/**
 * **Fallback State:**
 * Demonstrates what happens when the image URL is broken or missing.
 * The component detects the error and renders the `AvatarFallback` instead.
 */
export const WithFallback: Story = {
  args: {
    src: 'https://broken-image-url.com/image.png', // Broken URL to trigger onError
    fallbackText: 'JD',
  },
};

/**
 * **Loading State (No Image):**
 * Demonstrates the state when no `AvatarImage` is provided, showing only the fallback.
 */
export const NoImageProvided: Story = {
  render: ({ fallbackText, ...args }) => (
    <Avatar {...args}>
      {/* We omit AvatarImage to simulate no image source provided */}
      <AvatarFallback>{fallbackText}</AvatarFallback>
    </Avatar>
  ),
  args: {
    fallbackText: 'AB',
  },
};

/**
 * **Large Size:**
 * You can adjust the size using Tailwind classes on the root component.
 */
export const Large: Story = {
  args: {
    className: 'h-24 w-24', // Tailwind classes for sizing
    src: 'https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?&w=128&h=128&dpr=2&q=80',
    fallbackText: 'LG',
  },
};

/**
 * **Small Size:**
 * A smaller version suitable for compact lists or headers.
 */
export const Small: Story = {
  args: {
    className: 'h-6 w-6',
    fallbackText: 'SM',
  },
};