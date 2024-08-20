import React, { Component, ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
	children: ReactNode;
}

interface ErrorBoundaryState {
	hasError: boolean;
	error: Error | null;
	errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
	constructor(props: ErrorBoundaryProps) {
		super(props);
		this.state = { hasError: false, error: null, errorInfo: null };
	}

	static getDerivedStateFromError(error: Error): ErrorBoundaryState {
		// Update state so the next render will show the fallback UI.
		return { hasError: true, error, errorInfo: null };
	}

	componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		// You can also log the error to an error reporting service
		this.setState({ error, errorInfo });
		// eslint-disable-next-line
		console.error('Uncaught error:', error, errorInfo);
	}

	render() {
		const { children } = this.props;
		const { error, errorInfo, hasError } = this.state;

		if (hasError) {
			return (
				<div className="bg-white p-24">
					<h1 className="text-20 font-semibold">Something went wrong.</h1>
					<p className="text-14 whitespace-pre-wrap">
						{error && error.toString()}
						<br />
						{errorInfo && errorInfo.componentStack}
					</p>
				</div>
			);
		}

		return children;
	}
}

export default ErrorBoundary;
