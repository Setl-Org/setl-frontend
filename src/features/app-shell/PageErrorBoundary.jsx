import { Component } from "react";
import { EmptyState } from "@/components/app/EmptyState";
import { AppButton } from "@/components/app/AppButton";

/**
 * PageErrorBoundary - Contains a crash to the page that caused it, so the sidebar
 * and the rest of the app keep working. AppShell keys it by path, so moving to
 * another page clears the error. There is no client-error endpoint on the API yet,
 * so the error goes to the console only.
 */
export class PageErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error("Page crashed:", error, info?.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="rounded-2xl border border-hairline">
        <EmptyState
          tone="error"
          title="This page hit a problem"
          description="Something on this page failed to render. The rest of Setl still works, and your data hasn't changed."
          action={
            <>
              <AppButton size="sm" onClick={() => this.setState({ error: null })}>
                Try again
              </AppButton>
              <AppButton size="sm" variant="primary" to="/dashboard">
                Go to Home
              </AppButton>
            </>
          }
        />
      </div>
    );
  }
}
