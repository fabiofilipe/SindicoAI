import toast from 'react-hot-toast'
import { parseApiError } from '../utils/errorParser'

export function handleApiError(error: unknown, fallbackMessage = 'Ocorreu um erro inesperado.'): string {
    const parsed = parseApiError(error)
    const message = parsed.message || fallbackMessage
    toast.error(message)
    return message
}

export function handleApiSuccess(message: string): void {
    toast.success(message)
}

export function handleApiInfo(message: string): void {
    toast(message)
}
