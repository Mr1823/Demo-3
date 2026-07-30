import React from "react";
import { Link } from "react-router-dom";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-surface text-on-surface p-5">
          <div className="max-w-md w-full bg-surface-container rounded-lg p-8 shadow-xl text-center">
            <span className="material-symbols-outlined text-[48px] text-error mb-4">error</span>
            <h1 className="text-2xl font-display-md mb-2">Something went wrong</h1>
            <p className="text-on-surface-variant mb-6 text-sm">
              We're sorry, but an unexpected error occurred while loading this page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-primary text-white py-3 font-button-text tracking-widest hover:bg-primary-container transition-colors uppercase text-[12px] rounded-sm mb-4"
            >
              Reload Page
            </button>
            <button
              onClick={() => window.location.href = "/"}
              className="w-full bg-transparent border border-outline text-on-surface py-3 font-button-text tracking-widest hover:bg-surface-variant transition-colors uppercase text-[12px] rounded-sm"
            >
              Go to Home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
