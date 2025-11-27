import api from './api'
import type { CommonArea, CommonAreaCreate, CommonAreaUpdate } from '../types/commonArea'

export const listCommonAreas = async (): Promise<CommonArea[]> => {
    const response = await api.get('/common-areas/')
    return response.data
}

export const getCommonArea = async (id: string): Promise<CommonArea> => {
    const response = await api.get(`/common-areas/${id}`)
    return response.data
}

export const createCommonArea = async (data: CommonAreaCreate): Promise<CommonArea> => {
    const response = await api.post('/common-areas/', data)
    return response.data
}

export const updateCommonArea = async (id: string, data: CommonAreaUpdate): Promise<CommonArea> => {
    const response = await api.put(`/common-areas/${id}`, data)
    return response.data
}

export const deleteCommonArea = async (id: string): Promise<void> => {
    await api.delete(`/common-areas/${id}`)
}
