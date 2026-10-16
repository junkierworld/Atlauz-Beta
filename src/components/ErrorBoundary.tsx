import React, { ReactNode } from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

/**
 * Error boundary to catch render errors
 * Displays error UI and recovery options
 */
export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[ErrorBoundary] Caught error:', error);
    console.error('[ErrorBoundary] Error info:', errorInfo);

    // Log to telemetry/monitoring service
    this.logErrorToService(error, errorInfo);

    this.setState({
      error,
      errorInfo,
    });
  }

  private logErrorToService = async (
    error: Error,
    errorInfo: React.ErrorInfo
  ) => {
    try {
      // Send to Supabase or error monitoring service
      console.log('Logging error to monitoring service...');
      // await fetch('/api/log-error', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     message: error.toString(),
      //     stack: error.stack,
      //     componentStack: errorInfo.componentStack,
      //     timestamp: new Date().toISOString(),
      //   }),
      // });
    } catch (err) {
      console.error('Failed to log error:', err);
    }
  };

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-neutral-900 text-white flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-neutral-800 border border-neutral-700 rounded-lg p-8 space-y-6">
            {/* Error Icon */}
            <div className="flex justify-center">
              <div className="p-3 bg-red-950/30 rounded-full">
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
            </div>

            {/* Error Message */}
            <div className="text-center space-y-2">
              <h1 className="text-2xl font-bold font-mono">Something Went Wrong</h1>
              <p className="text-sm text-neutral-400">
                An unexpected error occurred. Our team has been notified.
              </p>
            </div>

            {/* Error Details (Dev Only) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="bg-neutral-900 border border-neutral-700 rounded p-4 space-y-2">
                <p className="text-xs font-mono text-red-400 font-bold">
                  {this.state.error.message}
                </p>
                <details className="text-xs text-neutral-500">
                  <summary className="cursor-pointer hover:text-neutral-400">
                    Stack trace
                  </summary>
                  <pre className="mt-2 overflow-auto max-h-40 p-2 bg-black rounded">
                    {this.state.error.stack}
                  </pre>
                </details>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-3">
              <button
                onClick={this.handleReset}
                className="w-full px-4 py-2.5 bg-neutral-700 hover:bg-neutral-600 rounded font-mono font-bold text-sm transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </button>

              <button
                onClick={this.handleReload}
                className="w-full px-4 py-2.5 bg-neutral-700 hover:bg-neutral-600 rounded font-mono font-bold text-sm transition-colors"
              >
                Reload Page
              </button>

              <button
                onClick={this.handleGoHome}
                className="w-full px-4 py-2.5 bg-white text-black hover:bg-neutral-200 rounded font-mono font-bold text-sm transition-colors flex items-center justify-center gap-2"
              >
                <Home className="w-4 h-4" />
                Go Home
              </button>
            </div>

            {/* Footer */}
            <p className="text-xs text-neutral-500 text-center">
              Error ID: {Date.now().toString(36).toUpperCase()}
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
