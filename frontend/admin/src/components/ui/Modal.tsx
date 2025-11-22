import { useEffect, type ReactNode } from 'react'
import { X } from 'lucide-react'
import Button from './Button'

interface ModalProps {
    isOpen: boolean
    onClose: () => void
    title: string
    children: ReactNode
    size?: 'sm' | 'md' | 'lg' | 'xl'
}

const Modal = ({ isOpen, onClose, title, children, size = 'md' }: ModalProps) => {
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

    if (!isOpen) return null

    const sizes = {
        sm: 'max-w-md',
        md: 'max-w-2xl',
        lg: 'max-w-4xl',
        xl: 'max-w-6xl',
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-coal/90 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div
                className={`
                    relative w-full ${sizes[size]}
                    bg-coal-light border border-cyan-glow/30 rounded-xl shadow-glow
                    max-h-[90vh] overflow-y-auto
                `}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-cyan-glow/20">
                    <h2 className="text-2xl font-bold text-cyan text-glow-cyan">
                        {title}
                    </h2>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClose}
                        className="!p-2"
                    >
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>
    )
}

export default Modal
