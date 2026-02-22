import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Button from '@shared/components/ui/Button'

describe('Button', () => {
    it('renders children', () => {
        render(<Button>Salvar</Button>)
        expect(screen.getByRole('button', { name: 'Salvar' })).toBeInTheDocument()
    })

    it('calls onClick when clicked', () => {
        const onClick = vi.fn()
        render(<Button onClick={onClick}>Clique</Button>)
        fireEvent.click(screen.getByRole('button'))
        expect(onClick).toHaveBeenCalledOnce()
    })

    it('is disabled when disabled prop is set', () => {
        render(<Button disabled>Bloqueado</Button>)
        expect(screen.getByRole('button')).toBeDisabled()
    })

    it('is disabled and shows spinner when isLoading', () => {
        render(<Button isLoading>Carregando</Button>)
        const btn = screen.getByRole('button')
        expect(btn).toBeDisabled()
        expect(btn.querySelector('svg')).toBeTruthy()
    })

    it('does not call onClick while loading', () => {
        const onClick = vi.fn()
        render(<Button isLoading onClick={onClick}>Espere</Button>)
        fireEvent.click(screen.getByRole('button'))
        expect(onClick).not.toHaveBeenCalled()
    })

    it('applies fullWidth class', () => {
        render(<Button fullWidth>Largo</Button>)
        expect(screen.getByRole('button').className).toContain('w-full')
    })

    it('forwards ref to button element', () => {
        const ref = { current: null } as React.RefObject<HTMLButtonElement | null>
        render(<Button ref={ref}>Ref</Button>)
        expect(ref.current).toBeInstanceOf(HTMLButtonElement)
    })

    it.each(['primary', 'secondary', 'outline', 'ghost', 'danger'] as const)(
        'renders variant=%s without error',
        (variant) => {
            render(<Button variant={variant}>{variant}</Button>)
            expect(screen.getByRole('button')).toBeInTheDocument()
        }
    )

    it.each(['sm', 'md', 'lg'] as const)(
        'renders size=%s without error',
        (size) => {
            render(<Button size={size}>{size}</Button>)
            expect(screen.getByRole('button')).toBeInTheDocument()
        }
    )
})
