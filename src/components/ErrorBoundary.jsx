import { Component } from 'react';
import { captureError } from '../lib/sentry';

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
    captureError(error, {
      componentStack: errorInfo.componentStack,
      errorBoundary: this.props.name || 'root',
    });
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback(this.state.error);

      return (
        <div className="min-h-screen bg-[#F2F0E9] flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-[#F2F0E9]/90 backdrop-blur-xl rounded-[2rem] border border-[#2E4036]/10 shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-[#CC5833]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">⚠️</span>
            </div>
            <h1 className="text-2xl font-bold text-[#1A1A1A] mb-2 font-['Plus_Jakarta_Sans']">Something went wrong</h1>
            <p className="text-[#2E4036]/60 mb-6 font-['Outfit']">We've been notified and will fix this soon. Try refreshing the page.</p>
            <div className="flex flex-col gap-3">
              <button onClick={() => window.location.reload()} className="w-full bg-[#2E4036] text-[#F2F0E9] py-3 rounded-full font-semibold hover:bg-[#1A1A1A] transition font-['Plus_Jakarta_Sans']">
                Refresh Page
              </button>
              <button onClick={() => window.location.href = '/'} className="w-full bg-[#2E4036]/5 text-[#1A1A1A] py-3 rounded-full font-semibold hover:bg-[#2E4036]/10 transition font-['Plus_Jakarta_Sans']">
                Go Home
              </button>
            </div>
            {import.meta.env.DEV && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="text-sm text-[#2E4036]/50 cursor-pointer hover:text-[#2E4036] font-['IBM_Plex_Mono']">
                  Error Details (dev only)
                </summary>
                <pre className="mt-2 p-3 bg-[#CC5833]/5 rounded-lg text-xs text-[#CC5833] overflow-auto max-h-40 font-['IBM_Plex_Mono']">
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

export function withErrorBoundary(Component, name) {
  return function ErrorBoundaryWrapper(props) {
    return (
      <ErrorBoundary name={name}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}
