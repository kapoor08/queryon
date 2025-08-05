/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

type State = { error: any };
type Props = {
  children: React.ReactNode;
};

class ErrorBoundary extends React.Component<Props, State> {
  state = { error: null };

  static getDerivedStateFromError(error: any) {
    // Update state so the next render will show the fallback UI.
    return { error };
  }

  componentDidCatch(error: any, info: any) {
    // TODO: log to Sentry?
    // eslint-disable-next-line no-console
    console.error("Error rendering Papercups chat:", error, info);
  }

  render() {
    if (this.state.error) {
      // TODO: should we render something different here?
      return null;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
