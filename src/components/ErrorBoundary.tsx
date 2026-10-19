import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught runtime rendering error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/';
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[70vh] flex items-center justify-center p-6 bg-background">
          <div className="max-w-md w-full p-8 rounded-3xl bg-card border border-destructive/20 shadow-2xl text-center space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center mx-auto">
              <AlertTriangle size={32} />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-xl font-black text-foreground">Something went wrong</h2>
              <p className="text-xs text-muted-foreground leading-relaxed">
                An unexpected issue occurred while rendering this section. You can reload the page or return to the home screen.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3 rounded-xl bg-muted/60 border border-border text-left font-mono text-[11px] text-destructive overflow-auto max-h-32">
                {this.state.error.message}
              </div>
            )}

            <div className="flex items-center justify-center gap-3 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={this.handleReload}
                className="rounded-xl text-xs gap-1.5"
              >
                <RefreshCw size={13} />
                <span>Reload Page</span>
              </Button>
              <Button
                size="sm"
                onClick={this.handleReset}
                className="rounded-xl text-xs gap-1.5 bg-primary text-primary-foreground"
              >
                <Home size={13} />
                <span>Go to Homepage</span>
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
