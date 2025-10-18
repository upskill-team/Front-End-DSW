import { AlertTriangle, RotateCcw } from 'lucide-react';
import Button from './Button';
import { Card, CardContent } from './Card';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
  isRetrying?: boolean;
  title?: string;
  description?: string;
}

export default function ErrorState({
  message = 'Ocurrió un error al cargar los datos.',
  onRetry,
  isRetrying = false,
  title = 'No se pudo cargar la información',
  description = 'Por favor, intenta de nuevo. Si el problema persiste, contacta a soporte.',
}: ErrorStateProps) {
  return (
    <div className="flex items-center justify-center py-12 px-4">
      <Card className="max-w-md w-full text-center">
        <CardContent className="py-12">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            {title}
          </h2>
          <p className="text-slate-600 mb-4">
            {message}
          </p>
          <p className="text-sm text-red-600 mb-6">
            {description}
          </p>
          {onRetry && (
            <Button onClick={onRetry} isLoading={isRetrying} className="bg-red-600 hover:bg-red-700">
              <RotateCcw className="w-4 h-4 mr-2" />
              {isRetrying ? 'Reintentando...' : 'Reintentar'}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}