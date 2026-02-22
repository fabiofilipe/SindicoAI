import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Card from '@shared/components/ui/Card'

describe('Card', () => {
    it('renders children', () => {
        render(<Card>Conteúdo do card</Card>)
        expect(screen.getByText('Conteúdo do card')).toBeInTheDocument()
    })

    it('is not clickable by default', () => {
        const { container } = render(<Card>Sem click</Card>)
        expect(container.firstChild).not.toHaveClass('cursor-pointer')
    })

    it('applies cursor-pointer when onClick is provided', () => {
        const onClick = vi.fn()
        const { container } = render(<Card onClick={onClick}>Clicável</Card>)
        expect(container.firstChild).toHaveClass('cursor-pointer')
    })

    it('calls onClick when clicked', () => {
        const onClick = vi.fn()
        render(<Card onClick={onClick}>Clique aqui</Card>)
        fireEvent.click(screen.getByText('Clique aqui'))
        expect(onClick).toHaveBeenCalledOnce()
    })

    it('renders default variant with bg-cream', () => {
        const { container } = render(<Card>Default</Card>)
        expect(container.firstChild).toHaveClass('bg-cream')
    })

    it('renders signature variant with border-border-brass', () => {
        const { container } = render(<Card variant="signature">Assinatura</Card>)
        expect(container.firstChild).toHaveClass('border-border-brass')
    })

    it('applies custom className', () => {
        const { container } = render(<Card className="my-custom-class">Classe</Card>)
        expect(container.firstChild).toHaveClass('my-custom-class')
    })

    it('applies animationDelay style when animate is true', () => {
        const { container } = render(<Card animate delay={0.3}>Animado</Card>)
        const el = container.firstChild as HTMLElement
        expect(el.style.animationDelay).toBe('300ms')
    })

    it('has no animationDelay style when animate is false', () => {
        const { container } = render(<Card animate={false}>Sem animação</Card>)
        const el = container.firstChild as HTMLElement
        expect(el.style.animationDelay).toBe('')
    })
})
