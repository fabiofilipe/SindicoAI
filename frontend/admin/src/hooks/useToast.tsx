import { useState, useCallback } from 'react'
import { ToastVariant } from '@/components/feedback/Toast'

interface ToastState {
    message: string
    variant: ToastVariant
    isVisible: boolean
}

export const useToast = () => {
    const [toast, setToast] = useState<ToastState>({
        message: '',
        variant: 'info',
        isVisible: false,
    })

    const showToast = useCallback((message: string, variant: ToastVariant = 'info') => {
        setToast({
            message,
            variant,
            isVisible: true,
        })
    }, [])

    const hideToast = useCallback(() => {
        setToast((prev) => ({ ...prev, isVisible: false }))
    }, [])

    const success = useCallback((message: string) => showToast(message, 'success'), [showToast])
    const error = useCallback((message: string) => showToast(message, 'error'), [showToast])
    const warning = useCallback((message: string) => showToast(message, 'warning'), [showToast])
    const info = useCallback((message: string) => showToast(message, 'info'), [showToast])

    return {
        toast,
        showToast,
        hideToast,
        success,
        error,
        warning,
        info,
    }
}
