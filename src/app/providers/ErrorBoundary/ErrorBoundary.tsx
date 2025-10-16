import React, { Component, ErrorInfo, ReactNode } from "react";

interface ErrorBoundaryProps {
    children: ReactNode;
    fallbackRender?: (
        error: Error,
        errorInfo: ErrorInfo,
        resetErrorBoundary: () => void
    ) => ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    state: ErrorBoundaryState = { hasError: false, error: null, errorInfo: null };

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error, errorInfo: null };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        this.setState({ errorInfo });
        console.error("ErrorBoundary caught an error", error, errorInfo);
    }

    resetErrorBoundary = () => {
        this.setState({ hasError: false, error: null, errorInfo: null });
    };

    render() {
        if (this.state.hasError && this.state.error && this.state.errorInfo) {
            if (this.props.fallbackRender) {
                return this.props.fallbackRender(
                    this.state.error,
                    this.state.errorInfo,
                    this.resetErrorBoundary
                );
            }
        }
        return this.props.children;
    }
}
