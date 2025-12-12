import type { Meta, StoryObj } from '@storybook/react-vite';
import CoursePreviewCard from './CoursePreviewCard';
import { BrowserRouter } from 'react-router-dom';
import type { Course } from '../../../types/entities';

/**
 * Mock data representing a Course.
 * We use 'as unknown as Course' to satisfy strict TypeScript checks
 * regarding deep nested interfaces (like Student[], Unit[], etc.) 
 * without having to mock every single property of the database schema.
 */
const mockCourse = {
  id: 'course_123',
  name: 'Introduction to React & Modern UI',
  description: 'Learn how to build modern interfaces, reusable components, and manage global state with 2024 best practices.',
  imageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=1000&auto=format&fit=crop',
  isFree: false,
  priceInCents: 2999, // $29.99
  status: 'published', // Mandatory field based on your interface
  
  // Nested Objects Mocking
  courseType: { id: 'type_1', name: 'Frontend Development' },
  
  // Assuming Professor interface structure based on usage
  professor: {
    id: 'prof_1',
    user: { name: 'Elena', surname: 'Torres' },
    institution: { id: 'inst_1', name: 'Tech University' }
  },
  
  // Optional root institution
  institution: { id: 'inst_1', name: 'Tech University' },
  
  // Arrays
  studentsCount: 342,
  students: [], 
  units: [{}, {}, {}, {}, {}], // Dummy units for length count
  
  createdAt: new Date(),
  updatedAt: new Date(),
} as unknown as Course; 

const meta = {
  title: 'Components/ui/CoursePreviewCard',
  component: CoursePreviewCard,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <BrowserRouter>
        <div className="w-[350px]">
          <Story />
        </div>
      </BrowserRouter>
    ),
  ],
  tags: ['autodocs'],
  argTypes: {
    hideButton: { control: 'boolean', description: 'Hides the call-to-action button' },
    hideInstructor: { control: 'boolean', description: 'Hides the instructor information' },
    course: { control: 'object', description: 'Full course object' },
  },
} satisfies Meta<typeof CoursePreviewCard>;

export default meta;
type Story = StoryObj<typeof CoursePreviewCard>

// --- Stories ---

export const Default: Story = {
  args: {
    course: mockCourse,
  },
};

export const FreeCourse: Story = {
  args: {
    // We spread the mock and cast again to ensure it fits the Course type
    course: {
      ...mockCourse,
      name: 'Programming Fundamentals',
      isFree: true,
      priceInCents: 0,
    } as unknown as Course,
  },
};

export const CreationPreview: Story = {
  args: {
    // Individual props mode (No course object passed)
    name: 'Draft Course Title',
    description: 'This is a description being typed by the professor in real-time to preview the card appearance...',
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1000&auto=format&fit=crop',
    isFree: false,
    price: 45.50,
    courseType: { id: '2', name: 'UX/UI Design' },
  },
};

export const NoImage: Story = {
  args: {
    course: {
      ...mockCourse,
      imageUrl: null as unknown as string, // Force null for visual test
      name: 'Course without cover image',
    } as unknown as Course,
  },
};

export const Minimal: Story = {
  args: {
    course: mockCourse,
    hideButton: true,
    hideInstructor: true,
  },
};