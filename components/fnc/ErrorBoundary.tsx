"use client";

import { Component, ReactNode } from "react";

class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error("Component Error:", error);
  }

  render() {
    if (this.state.hasError) {
      return <div>Something went wrong loading this component.</div>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
