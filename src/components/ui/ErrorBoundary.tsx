// src/components/ui/ErrorBoundary.tsx

import { Component } from 'react';
import type { ReactNode, ErrorInfo } from 'react';
import Button from './Button';
import { AlertTriangle } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error capturado por ErrorBoundary:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full min-h-[400px] flex items-center justify-center p-4 bg-slate-50">
          <div className="text-center max-w-md bg-white border-2 border-red-200 rounded-xl p-8 shadow-lg">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-red-900 mb-2">
              Oops, algo salió mal
            </h3>
            <p className="text-red-700 mb-6">
              Ocurrió un error inesperado al intentar mostrar esta sección.
            </p>
            
            {import.meta.env.DEV && this.state.error && (
              <details className="text-left mb-6 bg-red-50 p-3 rounded">
                <summary className="cursor-pointer text-sm text-red-600 hover:text-red-800 font-medium">
                  Detalles técnicos del error
                </summary>
                <pre className="mt-2 text-xs text-red-800 overflow-auto max-h-40">
                  {this.state.error.message}
                </pre>
              </details>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
                 <Button
                    onClick={() => (window.location.href = '/')}
                    variant="outline"
                    className="flex-1 border-slate-300"
                  >
                    Volver al Inicio
                 </Button>
                 <Button
                    onClick={this.handleReset}
                    className="flex-1 bg-red-600 hover:bg-red-700"
                  >
                    Intentar de nuevo
                 </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;