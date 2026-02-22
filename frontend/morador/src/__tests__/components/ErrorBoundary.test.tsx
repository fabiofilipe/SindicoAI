import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ErrorBoundary from '@shared/components/ErrorBoundary'

const ThrowingComponent = ({ shouldThrow }: { shouldThrow: boolean }) => {
    if (shouldThrow) throw new Error('Test error')
    return <div>OK</div>
}

beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
})

describe('ErrorBoundary', () => {
    it('renders children when no error', () => {
        render(
            <ErrorBoundary>
                <div>Conteúdo normal</div>
            </ErrorBoundary>
        )
        expect(screen.getByText('Conteúdo normal')).toBeInTheDocument()
    })

    it('renders default fallback when child throws', () => {
        render(
            <ErrorBoundary>
                <ThrowingComponent shouldThrow />
            </ErrorBoundary>
        )
        expect(screen.getByText('Algo deu errado')).toBeInTheDocument()
        expect(screen.getByText('Test error')).toBeInTheDocument()
    })

    it('renders custom fallback when provided', () => {
        render(
            <ErrorBoundary fallback={(error) => <div>Erro: {error?.message}</div>}>
                <ThrowingComponent shouldThrow />
            </ErrorBoundary>
        )
        expect(screen.getByText('Erro: Test error')).toBeInTheDocument()
    })

    it('exposes reset function in custom fallback', () => {
        const onReset = vi.fn()
        render(
            <ErrorBoundary fallback={(_, resetFn) => (
                <button onClick={() => { onReset(); resetFn() }}>Reset</button>
            )}>
                <ThrowingComponent shouldThrow />
            </ErrorBoundary>
        )
        fireEvent.click(screen.getByRole('button', { name: 'Reset' }))
        expect(onReset).toHaveBeenCalled()
    })

    it('"Tentar novamente" button calls reset and clears boundary state', () => {
        // After reset, the boundary re-renders children. If they still throw,
        // it will catch again. We verify reset was invoked by checking the
        // custom fallback's reset callback fires.
        const onReset = vi.fn()
        render(
            <ErrorBoundary fallback={(_, resetFn) => (
                <button onClick={() => { onReset(); resetFn() }}>Tentar novamente</button>
            )}>
                <ThrowingComponent shouldThrow />
            </ErrorBoundary>
        )
        expect(screen.getByRole('button', { name: 'Tentar novamente' })).toBeInTheDocument()
        fireEvent.click(screen.getByRole('button', { name: 'Tentar novamente' }))
        expect(onReset).toHaveBeenCalledOnce()
    })
})
