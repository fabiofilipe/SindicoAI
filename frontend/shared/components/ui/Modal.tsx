import { useEffect, type ReactNode } from 'react'
import { X } from 'lucide-react'
import Button from './Button'

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
    useEffect(() => {
        if (!isOpen) return

        document.body.style.overflow = 'hidden'

        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        }
        document.addEventListener('keydown', handleEsc)

        return () => {
            document.body.style.overflow = 'unset'
            document.removeEventListener('keydown', handleEsc)
        }
    }, [isOpen, onClose])

    const sizes = {
        sm: 'max-w-md',
        md: 'max-w-2xl',
        lg: 'max-w-4xl',
        xl: 'max-w-6xl',
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div
                className="absolute inset-0 bg-ink/40 animate-in fade-in duration-200"
                onClick={closeOnBackdrop ? onClose : undefined}
            />

            <div
                className={`
                    relative w-full ${sizes[size]}
                    bg-cream border border-border-light rounded-xl shadow-soft-xl
                    max-h-[90vh] overflow-y-auto
                    animate-in zoom-in-95 slide-in-from-bottom-2 duration-200
                `}
            >
                {title && (
                    <div className="flex items-center justify-between p-6 border-b border-border-light">
                        <h2 className="text-2xl font-display font-semibold text-ink">
                            {title}
                        </h2>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onClose}
                            className="!p-2 !rounded-full"
                        >
                            <X className="w-5 h-5" />
                        </Button>
                    </div>
                )}

                {!title && (
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-graphite hover:text-ink transition-colors"
                        aria-label="Fechar"
                    >
                        <X className="w-5 h-5" />
                    </button>
                )}

                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>
    )
}

export default Modal
