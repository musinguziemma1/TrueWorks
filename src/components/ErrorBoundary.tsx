import { Component, type ReactNode } from 'react';

interface Props { children: ReactNode; }
interface State { error: Error | null; }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: { componentStack?: string }) {
    console.error('ErrorBoundary caught:', error.message, error.stack);
    console.error('Component stack:', info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="pt-28 min-h-screen flex items-center justify-center p-8">
          <div className="text-center max-w-lg">
            <h1 className="font-heading text-2xl font-bold text-primary mb-4">Something went wrong</h1>
            <p className="text-text-secondary mb-4">{this.state.error.message}</p>
            <pre className="text-xs text-text-muted bg-section p-4 rounded-lg text-left overflow-auto max-h-48">{this.state.error.stack}</pre>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
