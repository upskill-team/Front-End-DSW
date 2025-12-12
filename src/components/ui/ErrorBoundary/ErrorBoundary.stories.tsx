
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import ErrorBoundary from './ErrorBoundary';
import Button from '../Button/Button';

const meta = {
	title: 'Components/ui/ErrorBoundary',
	component: ErrorBoundary,
	tags: ['autodocs'],
} satisfies Meta<typeof ErrorBoundary>;

export default meta;
type Story = StoryObj<typeof meta>;

const ProblemChild = ({ shouldThrow = false }: { shouldThrow?: boolean }) => {
	if (shouldThrow) throw new Error('Error simulado desde ProblemChild');
	return <div>Componente funcionando correctamente</div>;
};

export const Default: Story = {
	args: { children: <></> },
	render: () => {
		const [throwError, setThrowError] = useState(false);

		return (
			<div>
				<div className="mb-4">
					<Button onClick={() => setThrowError(true)}>Provocar error</Button>
				</div>
				<ErrorBoundary>
					<ProblemChild shouldThrow={throwError} />
				</ErrorBoundary>
			</div>
		);
	},
};

export const WithCustomFallback: Story = {
	args: { children: <></> },
	render: () => {
		const [throwError, setThrowError] = useState(false);

		return (
			<div>
				<div className="mb-4">
					<Button onClick={() => setThrowError(true)}>Provocar error</Button>
				</div>
				<ErrorBoundary
					fallback={
						<div className="p-6 bg-yellow-50 rounded">
							<h4 className="font-semibold">Fallback personalizado</h4>
							<p className="text-sm">Por favor recarga la página o inténtalo más tarde.</p>
						</div>
					}
				>
					<ProblemChild shouldThrow={throwError} />
				</ErrorBoundary>
			</div>
		);
	},
};
