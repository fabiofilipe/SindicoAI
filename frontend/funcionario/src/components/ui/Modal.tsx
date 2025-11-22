import React, { type ReactNode } from 'react'
import { X } from 'lucide-react'

interface ModalProps {
    isOpen: boolean
    onClose: () => void
    title: string
    children: ReactNode
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-coal/90 backdrop-blur-sm" />

            {/* Modal */}
            <div
                className="relative bg-charcoal border-2 border-neon-cyan/30 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-glow-cyan"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-neon-cyan/20">
                    <h2 className="text-2xl font-bold text-neon-cyan">{title}</h2>
                    <button
                        onClick={onClose}
                        className="text-metal-silver hover:text-neon-cyan transition-colors p-2"
                    >
                        <X size={24} />
                    </button>
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
