import React from "react";
import PageState from "./PageState";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("App error boundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <PageState
          title="Something went wrong"
          message="A page error occurred. You can return to the previous page or go back home."
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
