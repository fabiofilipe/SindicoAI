import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { X } from 'lucide-react'

interface ModalProps {
    isOpen: boolean
    onClose: () => void
    title?: string
    children: ReactNode
    size?: 'sm' | 'md' | 'lg' | 'xl'
    closeOnBackdrop?: boolean
}

const Modal = ({
    isOpen,
    onClose,
    title,
    children,
    size = 'md',
    closeOnBackdrop = true,
}: ModalProps) => {
    const sizes = {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
    }

    // Previne scroll do body quando modal está aberto
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }

        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isOpen])

    // Fecha modal ao pressionar ESC
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose()
            }
        }

        window.addEventListener('keydown', handleEsc)
        return () => window.removeEventListener('keydown', handleEsc)
    }, [isOpen, onClose])

    if (!isOpen) return null

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-coal/80 backdrop-blur-sm z-40 animate-in fade-in duration-200"
                onClick={closeOnBackdrop ? onClose : undefined}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div
                    onClick={(e) => e.stopPropagation()}
                    className={`
                        ${sizes[size]}
                        w-full
                        bg-coal-light
                        border border-cyan-glow/30
                        rounded-xl
                        shadow-glow-lg
                        max-h-[90vh]
                        overflow-hidden
                        flex flex-col
                        animate-in fade-in zoom-in-95 slide-in-from-bottom-4 duration-200
                    `}
                >
                    {/* Header */}
                    {title && (
                        <div className="flex items-center justify-between p-6 border-b border-cyan-glow/30">
                            <h2 className="text-xl font-bold text-cyan text-glow-cyan">
                                {title}
                            </h2>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-lg hover:bg-coal transition-colors"
                                aria-label="Fechar modal"
                            >
                                <X className="w-5 h-5 text-metal-silver hover:text-cyan transition-colors" />
                            </button>
                        </div>
                    )}

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6">
                        {children}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Modal
