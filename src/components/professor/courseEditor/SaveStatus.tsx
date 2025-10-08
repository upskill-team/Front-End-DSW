import { CheckCircle, AlertCircle, Loader2, WifiOff } from 'lucide-react';

interface SaveStatusProps {
  hasUnsavedChanges?: boolean;
  isLoading?: boolean;
  lastSavedAt?: Date;
  error?: string | null;
}

export default function SaveStatus({
  hasUnsavedChanges = false,
  isLoading = false,
  lastSavedAt,
  error,
}: SaveStatusProps) {
  if (error) {
    return (
      <div className="flex items-center gap-2 px-3 py-1 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
        <AlertCircle className="w-4 h-4" />
        <span>Error al guardar: {error}</span>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200 rounded-md text-blue-700 text-sm">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span>Guardando...</span>
      </div>
    );
  }

  if (hasUnsavedChanges) {
    return (
      <div className="flex items-center gap-2 px-3 py-1 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-700 text-sm">
        <WifiOff className="w-4 h-4" />
        <span>Cambios sin guardar</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 px-3 py-1 bg-green-50 border border-green-200 rounded-md text-green-700 text-sm">
      <CheckCircle className="w-4 h-4" />
      <span>
        {lastSavedAt
          ? `Guardado ${lastSavedAt.toLocaleTimeString()}`
          : 'Guardado'}
      </span>
    </div>
  );
}
