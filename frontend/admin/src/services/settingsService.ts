import api from './api'
import type { Settings, SettingsUpdate } from '@/types/settings'

export const getSettings = async (): Promise<Settings> => {
    const response = await api.get<Settings>('/settings')
    return response.data
}

export const updateSettings = async (data: SettingsUpdate): Promise<Settings> => {
    const response = await api.put<Settings>('/settings', data)
    return response.data
}
