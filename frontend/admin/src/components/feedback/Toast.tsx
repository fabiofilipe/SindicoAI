import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react'
import { useEffect } from 'react'

export type ToastVariant = 'success' | 'error' | 'warning' | 'info'

interface ToastProps {
    message: string
    variant?: ToastVariant
    isVisible: boolean
    onClose: () => void
    duration?: number
    position?: 'top-right' | 'top-center' | 'bottom-right' | 'bottom-center'
}

const variantConfig = {
    success: {
        icon: CheckCircle,
        bgClass: 'bg-terminalgreen/10 border-terminalgreen',
        iconClass: 'text-terminalgreen',
        glowClass: 'shadow-[0_0_20px_rgba(48,209,88,0.3)]',
    },
    error: {
        icon: XCircle,
        bgClass: 'bg-criticalred/10 border-criticalred',
        iconClass: 'text-criticalred',
        glowClass: 'shadow-[0_0_20px_rgba(255,69,58,0.3)]',
    },
    warning: {
        icon: AlertCircle,
        bgClass: 'bg-alertorange/10 border-alertorange',
        iconClass: 'text-alertorange',
        glowClass: 'shadow-[0_0_20px_rgba(255,159,10,0.3)]',
    },
    info: {
        icon: Info,
        bgClass: 'bg-techblue/10 border-techblue',
        iconClass: 'text-techblue',
        glowClass: 'shadow-[0_0_20px_rgba(10,132,255,0.3)]',
    },
}

const positionClasses = {
    'top-right': 'top-6 right-6',
    'top-center': 'top-6 left-1/2 -translate-x-1/2',
    'bottom-right': 'bottom-6 right-6',
    'bottom-center': 'bottom-6 left-1/2 -translate-x-1/2',
}

const Toast = ({
    message,
    variant = 'info',
    isVisible,
    onClose,
    duration = 5000,
    position = 'top-right',
}: ToastProps) => {
    const config = variantConfig[variant]
    const Icon = config.icon

    useEffect(() => {
        if (isVisible && duration > 0) {
            const timer = setTimeout(() => {
                onClose()
            }, duration)

            return () => clearTimeout(timer)
        }
    }, [isVisible, duration, onClose])

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className={`
                        fixed ${positionClasses[position]} z-[100]
                        min-w-[320px] max-w-md
                    `}
                >
                    <div
                        className={`
                            ${config.bgClass} ${config.glowClass}
                            backdrop-blur-md border rounded-lg p-4
                            flex items-start gap-3
                        `}
                    >
                        <Icon className={`w-5 h-5 ${config.iconClass} flex-shrink-0 mt-0.5`} />

                        <p className="flex-1 text-sm text-metal-silver">{message}</p>

                        <button
                            onClick={onClose}
                            className="text-metal-silver/60 hover:text-metal-silver transition-colors flex-shrink-0"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default Toast
