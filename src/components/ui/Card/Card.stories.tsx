import type { Meta, StoryObj } from '@storybook/react-vite';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from './Card';
import Button from '../Button/Button';
import Input from '../Input/Input';  

/**
 * Custom interface to control inner texts via Storybook Args,
 * while still accepting standard HTML Div props.
 */
type CardStoryProps = React.ComponentProps<typeof Card> & {
  titleText?: string;
  descriptionText?: string;
  contentText?: string;
};

const meta = {
  title: 'Components/ui/Card',
  component: Card,
  subcomponents: { CardHeader, CardTitle, CardDescription, CardContent } as Record<string, React.ComponentType>,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    titleText: { control: 'text', description: 'Content for CardTitle' },
    descriptionText: { control: 'text', description: 'Content for CardDescription' },
    contentText: { control: 'text', description: 'Content for CardContent' },
  },
  args: {
    className: 'w-[350px]', 
    titleText: 'Notifications',
    descriptionText: 'You have 3 unread messages.',
    contentText: 'Your subscription is about to expire. Please review your payment methods.',
  },
} satisfies Meta<CardStoryProps>;

export default meta;
type Story = StoryObj<CardStoryProps>;

/**
 * **Default Card:**
 * Shows the standard structure with Header (Title + Description) and Content.
 */
export const Default: Story = {
  render: ({ titleText, descriptionText, contentText, ...args }) => (
    <Card {...args}>
      <CardHeader>
        <CardTitle>{titleText}</CardTitle>
        <CardDescription>{descriptionText}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{contentText}</p>
      </CardContent>
    </Card>
  ),
};

/**
 * **Simple Card:**
 * A card with only content, useful for simple wrappers or images.
 */
export const SimpleContent: Story = {
  render: ({ contentText, ...args }) => (
    <Card {...args}>
      <CardContent className="pt-6">
        <p className="text-center font-medium">{contentText}</p>
      </CardContent>
    </Card>
  ),
  args: {
    contentText: 'This is a simple card without a header.',
  },
};

/**
 * **Form Example:**
 * Demonstrates how to compose other components (Input, Button) inside the Card.
 */
export const LoginForm: Story = {
  render: (args) => (
    <Card {...args}>
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>Enter your credentials to access your account.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input placeholder="m@example.com" type="email" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Password</label>
            <Input type="password" />
          </div>
          <Button fullWidth className="mt-4">Sign In</Button>
        </form>
      </CardContent>
    </Card>
  ),
  args: {
    className: 'w-[400px]',
  },
};