import { Component } from 'react';
import { captureError } from '../lib/sentry';

/**
 * Error Boundary that catches React errors and reports to Sentry
 */
export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught error:', error, errorInfo);
    
    // Report to Sentry with React component stack
    captureError(error, {
      componentStack: errorInfo.componentStack,
      errorBoundary: this.props.name || 'root',
    });
  }

  render() {
    if (this.state.hasError) {
      // Custom error UI
      if (this.props.fallback) {
        return this.props.fallback(this.state.error);
      }

      // Default error UI
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-primary-50/30 to-slate-50 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white/70 backdrop-blur-xl rounded-2xl border border-white/50 shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">⚠️</span>
            </div>
            
            <h1 className="text-2xl font-bold text-slate-800 mb-2">
              Something went wrong
            </h1>
            
            <p className="text-slate-600 mb-6">
              We've been notified and will fix this soon. Try refreshing the page.
            </p>
            
            <div className="flex flex-col gap-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-primary-600 text-white py-3 rounded-xl font-semibold hover:bg-primary-700 transition"
              >
                Refresh Page
              </button>
              
              <button
                onClick={() => window.location.href = '/'}
                className="w-full bg-slate-100 text-slate-700 py-3 rounded-xl font-semibold hover:bg-slate-200 transition"
              >
                Go Home
              </button>
            </div>
            
            {import.meta.env.DEV && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="text-sm text-slate-500 cursor-pointer hover:text-slate-700">
                  Error Details (dev only)
                </summary>
                <pre className="mt-2 p-3 bg-red-50 rounded-lg text-xs text-red-700 overflow-auto max-h-40">
                  {this.state.error.toString()}
                  {'\n\n'}
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Async error boundary for async operations
 * Usage: wrap async components or routes
 */
export function withErrorBoundary(Component, name) {
  return function ErrorBoundaryWrapper(props) {
    return (
      <ErrorBoundary name={name}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}
