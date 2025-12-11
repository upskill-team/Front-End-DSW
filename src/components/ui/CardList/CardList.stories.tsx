import type { Meta, StoryObj } from '@storybook/react-vite';
import CardList from './CardList';
import { BrowserRouter } from 'react-router-dom';
import type { Course } from '../../../types/entities';
const meta = {
  title: 'Components/ui/CardList',
  component: CardList,
  parameters: {
    layout: 'padded',
  },
  decorators: [
    (Story) => (
      <BrowserRouter>
        <div className="max-w-4xl mx-auto">
          <Story />
        </div>
      </BrowserRouter>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof CardList>;

export default meta;
type Story = StoryObj<typeof meta>;

// Historia Principal
export const Default: Story = {
  args: {
    course: {
      id: "c_001",
      name: "Master en React y TypeScript: De cero a experto",
      description: "Aprende a construir aplicaciones web modernas, escalables y robustas utilizando las últimas características de React 18.",
      imageUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=1000&auto=format&fit=crop",
      isFree: false,
      priceInCents: 4999,
      courseType: { name: "Desarrollo Web" },
      professor: { user: { name: "Carlos", surname: "Gómez" } },
      studentsCount: 1250,
      students: [],
      units: Array(12).fill({}),
      createdAt: new Date(),
      updatedAt: new Date(),
    } as unknown as Course, //
  },
};

// Historia Gratis
export const FreeCourse: Story = {
  args: {
    course: {
      id: "c_002",
      name: "Introducción a Python",
      description: "Curso básico para principiantes.",
      imageUrl: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?q=80&w=1000&auto=format&fit=crop",
      isFree: true,
      priceInCents: 0,
      courseType: { name: "Data Science" },
      professor: { user: { name: "Ana", surname: "Martínez" } },
      studentsCount: 5400,
      students: [],
      units: Array(5).fill({}),
      createdAt: new Date(),
      updatedAt: new Date(),
    } as unknown as Course,
  },
};