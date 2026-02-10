import api from './api'
import type { Event, EventRSVP, EventRSVPCreate } from '../types/models'

export const listEvents = async (params?: { upcoming?: boolean }): Promise<Event[]> => {
    const response = await api.get<Event[]>('/events/', { params })
    return response.data
}

export const getEvent = async (id: string): Promise<Event> => {
    const response = await api.get<Event>(`/events/${id}`)
    return response.data
}

export const createRSVP = async (
    eventId: string,
    data: EventRSVPCreate
): Promise<EventRSVP> => {
    const response = await api.post<EventRSVP>(`/events/${eventId}/rsvp`, data)
    return response.data
}

export const getMyRSVP = async (eventId: string): Promise<EventRSVP | null> => {
    try {
        const response = await api.get<EventRSVP>(`/events/${eventId}/my-rsvp`)
        return response.data
    } catch (error: any) {
        if (error.response?.status === 404) return null
        throw error
    }
}
