import api from './api'
import type { Unit, UnitCreate, UnitUpdate, UnitWithResidents, CSVImportResponse } from '../types/unit'

export const listUnits = async (): Promise<Unit[]> => {
    const response = await api.get('/units/')
    return response.data
}

export const getUnit = async (id: string): Promise<Unit> => {
    const response = await api.get(`/units/${id}`)
    return response.data
}

export const getUnitWithResidents = async (id: string): Promise<UnitWithResidents> => {
    const response = await api.get(`/units/${id}/with-residents`)
    return response.data
}

export const createUnit = async (data: UnitCreate): Promise<Unit> => {
    const response = await api.post('/units/', data)
    return response.data
}

export const updateUnit = async (id: string, data: UnitUpdate): Promise<Unit> => {
    const response = await api.put(`/units/${id}`, data)
    return response.data
}

export const deleteUnit = async (id: string): Promise<void> => {
    await api.delete(`/units/${id}`)
}

export const assignUserToUnit = async (unitId: string, userId: string): Promise<{ message: string }> => {
    const response = await api.put(`/units/${unitId}/assign-user`, { user_id: userId })
    return response.data
}

export const removeUserFromUnit = async (unitId: string, userId: string): Promise<{ message: string }> => {
    const response = await api.delete(`/units/${unitId}/remove-user/${userId}`)
    return response.data
}

export const importUnitsCSV = async (file: File): Promise<CSVImportResponse> => {
    const formData = new FormData()
    formData.append('file', file)

    const response = await api.post('/units/import-csv', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
    return response.data
}
