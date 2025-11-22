import api from './api'

/**
 * Serviço de IA / Assistente Virtual
 * Gerencia chat com RAG sobre documentos do condomínio
 */

export interface ChatRequest {
    question: string
    max_chunks?: number
}

export interface ChatSource {
    filename: string
    page?: number
    chunk_index?: number
}

export interface ChatResponse {
    answer: string
    sources: ChatSource[]
    confidence?: number
}

/**
 * Envia uma pergunta para o assistente virtual
 */
export const chat = async (request: ChatRequest): Promise<ChatResponse> => {
    const response = await api.post<ChatResponse>('/ai/chat', {
        question: request.question,
        max_chunks: request.max_chunks || 5,
    })
    return response.data
}

/**
 * Obtém estatísticas de uso do usuário atual
 */
export const getUsageStats = async (): Promise<any> => {
    const response = await api.get('/ai/usage')
    return response.data
}

/**
 * Obtém estatísticas do cache
 */
export const getCacheStats = async (): Promise<any> => {
    const response = await api.get('/ai/cache/stats')
    return response.data
}
