import React, { Component } from 'react'
import type { ReactNode } from 'react'
import ErrorPage from './ErrorPage'

interface Props {
    children: ReactNode
}

interface State {
    hasError: boolean
    error: Error | null
    errorInfo: React.ErrorInfo | null
}

class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
        }
    }

    static getDerivedStateFromError(error: Error): Partial<State> {
        // Update state so the next render will show the fallback UI
        return { hasError: true, error }
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        // Log error details to console
        console.error('🚨 Error Boundary caught an error:')
        console.error('Error:', error)
        console.error('Error Info:', errorInfo)
        console.error('Component Stack:', errorInfo.componentStack)

        // Update state with error details
        this.setState({
            error,
            errorInfo,
        })

        // TODO: Send error to logging service (e.g., Sentry, LogRocket)
        // trackError(error, errorInfo)
    }

    resetError = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
        })
    }

    render() {
        if (this.state.hasError) {
            return (
                <ErrorPage
                    error={this.state.error}
                    errorInfo={this.state.errorInfo}
                    resetError={this.resetError}
                />
            )
        }

        return this.props.children
    }
}

export default ErrorBoundary
