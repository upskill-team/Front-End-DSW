
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useState } from 'react';

import { Dialog, DialogHeader, DialogTitle } from './Dialog';
import Button from '../Button/Button';

const meta = {
	title: 'Components/ui/Dialog',
	component: Dialog,
	tags: ['autodocs'],
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		open: false,
		onOpenChange: () => {},
		children: null,
	},
	render: () => {
		const [open, setOpen] = useState(false);

		useEffect(() => {
			let portal = document.getElementById('modal-portal');
			if (!portal) {
				portal = document.createElement('div');
				portal.id = 'modal-portal';
				document.body.appendChild(portal);
			}
		}, []);

		return (
			<>
				<Button onClick={() => setOpen(true)}>Abrir diálogo</Button>
				<Dialog open={open} onOpenChange={setOpen}>
					<DialogHeader>
						<DialogTitle>Confirmación</DialogTitle>
					</DialogHeader>
					<div className="text-sm text-slate-700">¿Deseas continuar con esta acción?</div>
					<div className="mt-4 flex justify-end gap-2">
						<Button variant="ghost" onClick={() => setOpen(false)}>
							Cancelar
						</Button>
						<Button onClick={() => setOpen(false)}>Aceptar</Button>
					</div>
				</Dialog>
			</>
		);
	},
};

export const OpenByDefault: Story = {
	args: {
		open: true,
		onOpenChange: () => {},
		children: null,
	},
	render: () => {
		const [open, setOpen] = useState(true);

		useEffect(() => {
			let portal = document.getElementById('modal-portal');
			if (!portal) {
				portal = document.createElement('div');
				portal.id = 'modal-portal';
				document.body.appendChild(portal);
			}
		}, []);

		return (
			<>
				<Button onClick={() => setOpen(true)}>Abrir diálogo</Button>
				<Dialog open={open} onOpenChange={setOpen}>
					<DialogHeader>
						<DialogTitle>Diálogo abierto</DialogTitle>
					</DialogHeader>
					<div className="text-sm text-slate-700">Este diálogo está abierto por defecto.</div>
					<div className="mt-4 flex justify-end gap-2">
						<Button variant="ghost" onClick={() => setOpen(false)}>
							Cerrar
						</Button>
					</div>
				</Dialog>
			</>
		);
	},
};
