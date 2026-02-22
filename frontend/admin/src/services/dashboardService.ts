import api from './api'

export const fetchDashboardData = async (): Promise<{
    users: any[]
    reservations: any[]
    areas: any[]
}> => {
    const [usersResponse, reservationsResponse, areasResponse] = await Promise.all([
        api.get('/users'),
        api.get('/reservations'),
        api.get('/areas'),
    ])
    return {
        users: usersResponse.data,
        reservations: reservationsResponse.data,
        areas: areasResponse.data,
    }
}
