import api from './api'
import type { Event, EventCreate, EventUpdate, EventRSVP } from '../types/event'

export const getEvents = async (params?: { status?: string, upcoming?: boolean }): Promise<Event[]> => {
    const response = await api.get<Event[]>('/events/', { params })
    return response.data
}

export const getEvent = async (id: string): Promise<Event> => {
    const response = await api.get<Event>(`/events/${id}`)
    return response.data
}

export const createEvent = async (data: EventCreate): Promise<Event> => {
    const response = await api.post<Event>('/events/', data)
    return response.data
}

export const updateEvent = async (eventId: string, data: EventUpdate): Promise<Event> => {
    const response = await api.put<Event>(`/events/${eventId}`, data)
    return response.data
}

export const deleteEvent = async (eventId: string): Promise<void> => {
    await api.delete(`/events/${eventId}`)
}

export const getEventRSVPs = async (eventId: string): Promise<EventRSVP[]> => {
    const response = await api.get<EventRSVP[]>(`/events/${eventId}/rsvps`)
    return response.data
}

export const markAttendance = async (rsvpId: string, attended: boolean): Promise<EventRSVP> => {
    const response = await api.put<EventRSVP>(`/events/rsvps/${rsvpId}/attendance?attended=${attended}`)
    return response.data
}
