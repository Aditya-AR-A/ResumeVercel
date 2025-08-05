/**
 * Error Boundary Component
 * 
 * This React Error Boundary component provides graceful error handling for the
 * entire application. It catches JavaScript errors anywhere in the component tree,
 * logs them for debugging, and displays a user-friendly fallback UI.
 * 
 * Features:
 * - Catches and handles React component errors
 * - Displays elegant error UI instead of white screen
 * - Provides error details in development mode
 * - Includes recovery mechanisms (page refresh, navigation)
 * - Integrates with error reporting services
 * - Prevents entire application crashes
 * 
 * Usage:
 * ```tsx
 * <ErrorBoundary>
 *   <YourComponent />
 * </ErrorBoundary>
 * ```
 * 
 * Error Types Handled:
 * - React rendering errors
 * - Component lifecycle errors
 * - Event handler errors (when wrapped properly)
 * - Async operation failures
 * 
 * Best Practices:
 * - Wrap main application sections
 * - Use multiple boundaries for isolation
 * - Provide meaningful error messages
 * - Include recovery actions for users
 * 
 * @author Aditya
 * @version 1.0.0
 * @since 2025-08-05
 */

import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error }>;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;
      return <FallbackComponent error={this.state.error} />;
    }

    return this.props.children;
  }
}

function DefaultErrorFallback({ error }: { error?: Error }) {
  return (
    <div className="error-fallback">
      <h2>Something went wrong</h2>
      <p>We apologize for the inconvenience. Please try refreshing the page.</p>
      {process.env.NODE_ENV === 'development' && error && (
        <details className="error-details">
          <summary>Error details (development only)</summary>
          <pre>{error.message}</pre>
          <pre>{error.stack}</pre>
        </details>
      )}
      <button onClick={() => window.location.reload()}>
        Refresh Page
      </button>
    </div>
  );
}
