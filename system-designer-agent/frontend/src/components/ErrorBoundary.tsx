import { Component, ReactNode } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div
          className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6"
          role="alert"
          aria-live="assertive"
        >
          <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-md w-full border border-slate-200 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="text-red-600" size={32} aria-hidden="true" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 mb-3">
              Something went wrong
            </h1>
            <p className="text-slate-500 mb-6">
              An unexpected error occurred. Please try refreshing the page.
            </p>
            {this.state.error && (
              <details className="text-left bg-slate-50 rounded-xl p-4 mb-6">
                <summary className="cursor-pointer text-sm font-bold text-slate-700">
                  Error Details
                </summary>
                <pre className="mt-2 text-xs text-red-600 overflow-auto">
                  {this.state.error.message}
                </pre>
              </details>
            )}
            <button
              onClick={this.handleReset}
              className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all active:scale-95 mx-auto"
            >
              <RotateCcw size={18} aria-hidden="true" />
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
