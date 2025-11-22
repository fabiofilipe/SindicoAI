import api from './api'
import type { DashboardMetrics } from '@/types/dashboard'

export const getDashboardMetrics = async (): Promise<DashboardMetrics> => {
    // Por enquanto, vamos criar métricas mockadas
    // No futuro, criar endpoint no backend: GET /api/v1/dashboard/metrics

    try {
        // Tentar buscar dados reais da API
        const [usersResponse, reservationsResponse, areasResponse] = await Promise.all([
            api.get('/users'),
            api.get('/reservations'),
            api.get('/areas'),
        ])

        const users = usersResponse.data as any[]
        const reservations = reservationsResponse.data as any[]
        const areas = areasResponse.data as any[]

        const metrics: DashboardMetrics = {
            total_users: users.length,
            total_residents: users.filter((u: any) => u.role === 'resident').length,
            total_staff: users.filter((u: any) => u.role === 'staff').length,
            total_admins: users.filter((u: any) => u.role === 'admin').length,
            total_reservations: reservations.length,
            total_areas: areas.length,
            active_reservations: reservations.filter((r: any) => r.status === 'confirmed' || r.status === 'in_progress').length,
            recent_users: users.filter((u: any) => {
                const created = new Date(u.created_at)
                const weekAgo = new Date()
                weekAgo.setDate(weekAgo.getDate() - 7)
                return created > weekAgo
            }).length,
        }

        return metrics
    } catch (error) {
        console.error('Erro ao buscar métricas:', error)

        // Retorna métricas vazias em caso de erro
        return {
            total_users: 0,
            total_residents: 0,
            total_staff: 0,
            total_admins: 0,
            total_reservations: 0,
            total_areas: 0,
            active_reservations: 0,
            recent_users: 0,
        }
    }
}
