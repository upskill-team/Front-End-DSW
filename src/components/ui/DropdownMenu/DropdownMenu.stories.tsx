
import type { Meta, StoryObj } from '@storybook/react-vite';


import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
} from './DropdownMenu';
import Button from '../Button/Button';

const meta = {
	title: 'Components/ui/DropdownMenu',
	component: DropdownMenu,
	tags: ['autodocs'],
} satisfies Meta<typeof DropdownMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: { children: null },
	render: () => (
		<DropdownMenu>
			<DropdownMenuTrigger>
				<Button>Opciones</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuItem onClick={() => alert('Perfil')}>Perfil</DropdownMenuItem>
				<DropdownMenuItem onClick={() => alert('Ajustes')}>Ajustes</DropdownMenuItem>
				<DropdownMenuItem onClick={() => alert('Ayuda')}>Ayuda</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	),
};

export const WithSeparator: Story = {
	args: { children: null },
	render: () => (
		<DropdownMenu>
			<DropdownMenuTrigger>
				<Button>Cuenta</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuItem onClick={() => alert('Mi cuenta')}>Mi cuenta</DropdownMenuItem>
				<DropdownMenuItem onClick={() => alert('Mis suscripciones')}>Mis suscripciones</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem onClick={() => alert('Cerrar sesión')}>Cerrar sesión</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	),
};
