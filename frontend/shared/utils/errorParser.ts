interface AxiosLikeError {
    response?: {
        status?: number
        data?: {
            detail?: string | Array<{ msg?: string }>
            [key: string]: unknown
        }
    }
    message?: string
    config?: unknown
}

export interface ParsedError {
    message: string
    status?: number
    detail?: unknown
}

function isAxiosError(error: unknown): error is AxiosLikeError {
    return (
        typeof error === 'object' &&
        error !== null &&
        'config' in error
    )
}

export function parseApiError(error: unknown): ParsedError {
    if (isAxiosError(error)) {
        const status = error.response?.status
        const data = error.response?.data

        if (typeof data?.detail === 'string') {
            return { message: data.detail, status }
        }

        if (Array.isArray(data?.detail)) {
            const msg = data.detail.map((e) => e.msg ?? '').filter(Boolean).join(', ')
            return { message: msg || 'Dados inválidos.', status, detail: data.detail }
        }

        if (status === 401) return { message: 'Sessão expirada. Faça login novamente.', status }
        if (status === 403) return { message: 'Acesso negado.', status }
        if (status === 404) return { message: 'Recurso não encontrado.', status }
        if (status === 422) return { message: 'Dados inválidos.', status, detail: data }
        if (status === 429) return { message: 'Limite de requisições atingido. Tente novamente mais tarde.', status }
        if (status !== undefined && status >= 500) return { message: 'Erro no servidor. Tente novamente.', status }

        return { message: error.message ?? 'Erro desconhecido.', status }
    }

    if (error instanceof Error) {
        return { message: error.message }
    }

    return { message: 'Ocorreu um erro inesperado.' }
}
