import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { Button, Callout, Flex } from '@radix-ui/themes';
import { XCircle } from 'lucide-react';

interface Props { children: ReactNode; }
interface State { hasError: boolean; error: Error | null; }

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ maxWidth: 800, margin: '48px auto', padding: '0 16px' }}>
          <Callout.Root color="red" size="2">
            <Callout.Icon><XCircle size={18} /></Callout.Icon>
            <Callout.Text>
              <strong>Something went wrong</strong>
              <p style={{ margin: '4px 0 8px' }}>
                We're sorry, but something unexpected happened. Please try refreshing the page or go back to the home page.
              </p>
              {import.meta.env.MODE === 'development' && this.state.error && (
                <details style={{ marginBottom: 12 }}>
                  <summary>Error details (dev only)</summary>
                  <pre style={{ marginTop: 8, padding: 8, background: 'rgba(0,0,0,0.1)', borderRadius: 4, overflow: 'auto', fontSize: 12 }}>
                    {this.state.error.toString()}
                  </pre>
                </details>
              )}
              <Flex gap="2">
                <Button size="2" onClick={this.handleReset}>Go to Home</Button>
                <Button size="2" variant="outline" onClick={() => window.location.reload()}>Refresh Page</Button>
              </Flex>
            </Callout.Text>
          </Callout.Root>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
