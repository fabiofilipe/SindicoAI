import { create } from 'zustand'

interface Toast {
    id: string
    title?: string
    message: string
    type: 'success' | 'error' | 'warning' | 'info'
    duration?: number
}

interface NotificationState {
    toasts: Toast[]

    // Actions
    addToast: (toast: Omit<Toast, 'id'>) => void
    removeToast: (id: string) => void
    clearToasts: () => void
}

export const useNotificationStore = create<NotificationState>((set) => ({
    toasts: [],

    addToast: (toast) => {
        const id = Math.random().toString(36).substring(7)
        const newToast = { ...toast, id }

        set((state) => ({
            toasts: [...state.toasts, newToast],
        }))

        // Auto remove after duration
        const duration = toast.duration || 5000
        setTimeout(() => {
            set((state) => ({
                toasts: state.toasts.filter((t) => t.id !== id),
            }))
        }, duration)
    },

    removeToast: (id) =>
        set((state) => ({
            toasts: state.toasts.filter((t) => t.id !== id),
        })),

    clearToasts: () => set({ toasts: [] }),
}))
