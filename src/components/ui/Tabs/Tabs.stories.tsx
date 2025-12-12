
import type { Meta, StoryObj } from '@storybook/react-vite';


import { Tabs, TabsList, TabsTrigger, TabsContent } from './Tabs';

const meta = {
	title: 'Components/ui/Tabs',
	component: Tabs,
	tags: ['autodocs'],
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: { defaultValue: 'tab1', children: <></> },
	render: (args) => (
		<Tabs defaultValue={args.defaultValue}>
			<TabsList>
				<TabsTrigger value="tab1">Tab 1</TabsTrigger>
				<TabsTrigger value="tab2">Tab 2</TabsTrigger>
			</TabsList>
			<TabsContent value="tab1">Contenido de la pestaña 1</TabsContent>
			<TabsContent value="tab2">Contenido de la pestaña 2</TabsContent>
		</Tabs>
	),
};

export const ThreeTabs: Story = {
	args: { defaultValue: 'first', children: <></> },
	render: (args) => (
		<Tabs defaultValue={args.defaultValue}>
			<TabsList>
				<TabsTrigger value="first">Primera</TabsTrigger>
				<TabsTrigger value="second">Segunda</TabsTrigger>
				<TabsTrigger value="third">Tercera</TabsTrigger>
			</TabsList>
			<TabsContent value="first">Contenido de la primera pestaña</TabsContent>
			<TabsContent value="second">Contenido de la segunda pestaña</TabsContent>
			<TabsContent value="third">Contenido de la tercera pestaña</TabsContent>
		</Tabs>
	),
};
