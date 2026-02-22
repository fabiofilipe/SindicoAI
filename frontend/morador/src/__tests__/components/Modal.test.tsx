import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Modal from '@shared/components/ui/Modal'

describe('Modal', () => {
    it('renders nothing when isOpen is false', () => {
        const { container } = render(
            <Modal isOpen={false} onClose={vi.fn()}>Conteúdo</Modal>
        )
        expect(container).toBeEmptyDOMElement()
    })

    it('renders children when isOpen is true', () => {
        render(
            <Modal isOpen onClose={vi.fn()}>Conteúdo do modal</Modal>
        )
        expect(screen.getByText('Conteúdo do modal')).toBeInTheDocument()
    })

    it('renders title when provided', () => {
        render(
            <Modal isOpen onClose={vi.fn()} title="Título do Modal">Corpo</Modal>
        )
        expect(screen.getByText('Título do Modal')).toBeInTheDocument()
    })

    it('calls onClose when clicking backdrop (closeOnBackdrop=true)', () => {
        const onClose = vi.fn()
        const { container } = render(
            <Modal isOpen onClose={onClose} closeOnBackdrop>Conteúdo</Modal>
        )
        const backdrop = container.querySelector('.absolute.inset-0') as HTMLElement
        fireEvent.click(backdrop)
        expect(onClose).toHaveBeenCalledOnce()
    })

    it('does not call onClose when backdrop clicked if closeOnBackdrop=false', () => {
        const onClose = vi.fn()
        const { container } = render(
            <Modal isOpen onClose={onClose} closeOnBackdrop={false}>Conteúdo</Modal>
        )
        const backdrop = container.querySelector('.absolute.inset-0') as HTMLElement
        fireEvent.click(backdrop)
        expect(onClose).not.toHaveBeenCalled()
    })

    it('calls onClose on Escape key press', () => {
        const onClose = vi.fn()
        render(
            <Modal isOpen onClose={onClose}>Conteúdo</Modal>
        )
        fireEvent.keyDown(document, { key: 'Escape' })
        expect(onClose).toHaveBeenCalledOnce()
    })

    it('does not call onClose on other key press', () => {
        const onClose = vi.fn()
        render(
            <Modal isOpen onClose={onClose}>Conteúdo</Modal>
        )
        fireEvent.keyDown(document, { key: 'Enter' })
        expect(onClose).not.toHaveBeenCalled()
    })

    it('locks body scroll when open', () => {
        render(
            <Modal isOpen onClose={vi.fn()}>Conteúdo</Modal>
        )
        expect(document.body.style.overflow).toBe('hidden')
    })

    it('shows close button when no title', () => {
        render(
            <Modal isOpen onClose={vi.fn()}>Sem título</Modal>
        )
        expect(screen.getByLabelText('Fechar')).toBeInTheDocument()
    })
})
