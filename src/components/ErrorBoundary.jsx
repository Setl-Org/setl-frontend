import { Component } from "react";
import { Button } from "@/components/ui/Button";

/**
 * ErrorBoundary - Catches React errors and displays a fallback UI.
 * Wrap route trees or critical sections to prevent full-app crashes.
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
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      const fallback = this.props.fallback;
      if (fallback) return fallback;

      return (
        <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 p-8 text-center">
          <h2 className="text-xl font-semibold text-secondary">
            Something went wrong
          </h2>
          <p className="max-w-md text-muted-foreground">
            An unexpected error occurred. Please try again.
          </p>
          <Button variant="tertiary" onClick={this.handleRetry}>
            Try again
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
