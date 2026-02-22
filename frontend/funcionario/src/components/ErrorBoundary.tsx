import type { ReactNode } from 'react'
import { default as SharedErrorBoundary } from '@shared/components/ErrorBoundary'
import ErrorPage from './ErrorPage'

interface Props { children: ReactNode }

const ErrorBoundary = ({ children }: Props) => (
    <SharedErrorBoundary
        fallback={(error, reset) => (
            <ErrorPage error={error} errorInfo={null} resetError={reset} />
        )}
    >
        {children}
    </SharedErrorBoundary>
)

export default ErrorBoundary
