import React, { Component } from 'react'
import type { ReactNode } from 'react'

interface Props {
    children: ReactNode
    fallback?: (error: Error | null, reset: () => void) => ReactNode
}

interface State {
    hasError: boolean
    error: Error | null
    errorInfo: React.ErrorInfo | null
}

class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = { hasError: false, error: null, errorInfo: null }
    }

    static getDerivedStateFromError(error: Error): Partial<State> {
        return { hasError: true, error }
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('ErrorBoundary caught:', error, errorInfo.componentStack)
        this.setState({ error, errorInfo })
    }

    resetError = () => {
        this.setState({ hasError: false, error: null, errorInfo: null })
    }

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback(this.state.error, this.resetError)
            }

            return (
                <div className="min-h-screen flex items-center justify-center p-6 bg-cream">
                    <div className="text-center max-w-md">
                        <h2 className="text-2xl font-semibold text-ink mb-2">Algo deu errado</h2>
                        <p className="text-graphite mb-6">
                            {this.state.error?.message ?? 'Ocorreu um erro inesperado.'}
                        </p>
                        <button
                            onClick={this.resetError}
                            className="px-6 py-3 bg-brass text-cream rounded hover:bg-brass-light transition-colors"
                        >
                            Tentar novamente
                        </button>
                    </div>
                </div>
            )
        }

        return this.props.children
    }
}

export default ErrorBoundary
