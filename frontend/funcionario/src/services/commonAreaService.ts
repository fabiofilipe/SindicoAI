import api from './api'
import type { CommonArea } from '@/types/models'

/**
 * Serviço de Áreas Comuns
 * Gerencia áreas comuns do condomínio
 */

/**
 * Lista todas as áreas comuns do tenant
 */
export const listCommonAreas = async (): Promise<CommonArea[]> => {
    const response = await api.get<CommonArea[]>('/common-areas/')
    return response.data
}

/**
 * Busca uma área comum específica por ID
 */
export const getCommonArea = async (id: string): Promise<CommonArea> => {
    const response = await api.get<CommonArea>(`/common-areas/${id}`)
    return response.data
}
