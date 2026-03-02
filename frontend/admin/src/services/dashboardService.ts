import api from './api'

const extractItems = (data: any): any[] => Array.isArray(data) ? data : (data?.items ?? [])

export const fetchDashboardData = async (): Promise<{
    users: any[]
    reservations: any[]
    areas: any[]
}> => {
    const [usersResponse, reservationsResponse, areasResponse] = await Promise.all([
        api.get('/users', { params: { page_size: 9999 } }),
        api.get('/reservations', { params: { page_size: 9999 } }),
        api.get('/areas', { params: { page_size: 9999 } }),
    ])
    return {
        users: extractItems(usersResponse.data),
        reservations: extractItems(reservationsResponse.data),
        areas: extractItems(areasResponse.data),
    }
}
