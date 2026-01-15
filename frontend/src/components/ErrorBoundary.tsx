import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { Container, Alert, Button } from 'react-bootstrap';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);

    // Log to error reporting service in production
    if (import.meta.env.MODE === 'production') {
      // Example: logErrorToService(error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <Container className="py-5">
          <Alert variant="danger">
            <Alert.Heading>Something went wrong</Alert.Heading>
            <p>
              We're sorry, but something unexpected happened. Please try
              refreshing the page or go back to the home page.
            </p>
            {import.meta.env.MODE === 'development' && this.state.error && (
              <details className="mt-3">
                <summary>Error details (dev only)</summary>
                <pre className="mt-2 p-2 bg-light">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
            <hr />
            <div className="d-flex gap-2">
              <Button variant="primary" onClick={this.handleReset}>
                Go to Home
              </Button>
              <Button
                variant="secondary"
                onClick={() => window.location.reload()}
              >
                Refresh Page
              </Button>
            </div>
          </Alert>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
