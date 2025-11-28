import api from './api'
import type { CommonAreasUsageReport, ReservationsReport, ReportFilters } from '@/types/report'

/**
 * Serviço de Relatórios - Admin
 * Gerencia relatórios e exportação de dados
 */

/**
 * Obtém relatório de uso de áreas comuns
 */
export const getCommonAreasUsageReport = async (
    startDate?: string,
    endDate?: string
): Promise<CommonAreasUsageReport> => {
    const params: Record<string, string> = {}
    if (startDate) params.start_date = startDate
    if (endDate) params.end_date = endDate

    const response = await api.get<CommonAreasUsageReport>('/reports/common-areas-usage', { params })
    return response.data
}

/**
 * Obtém relatório de reservas
 */
export const getReservationsReport = async (
    filters: ReportFilters = {}
): Promise<ReservationsReport> => {
    const params: Record<string, string> = {}
    if (filters.start_date) params.start_date = filters.start_date
    if (filters.end_date) params.end_date = filters.end_date
    if (filters.status) params.status = filters.status
    if (filters.common_area_id) params.common_area_id = filters.common_area_id

    const response = await api.get<ReservationsReport>('/reports/reservations', { params })
    return response.data
}

/**
 * Exporta relatório de áreas comuns em CSV
 */
export const exportCommonAreasUsageCSV = async (
    startDate?: string,
    endDate?: string
): Promise<Blob> => {
    const params: Record<string, string> = { format: 'csv' }
    if (startDate) params.start_date = startDate
    if (endDate) params.end_date = endDate

    const response = await api.get('/reports/common-areas-usage', {
        params,
        responseType: 'blob'
    })
    return response.data
}

/**
 * Exporta relatório de reservas em CSV
 */
export const exportReservationsCSV = async (
    filters: ReportFilters = {}
): Promise<Blob> => {
    const params: Record<string, string> = { format: 'csv' }
    if (filters.start_date) params.start_date = filters.start_date
    if (filters.end_date) params.end_date = filters.end_date
    if (filters.status) params.status = filters.status
    if (filters.common_area_id) params.common_area_id = filters.common_area_id

    const response = await api.get('/reports/reservations', {
        params,
        responseType: 'blob'
    })
    return response.data
}

/**
 * Helper para fazer download de arquivo CSV
 */
export const downloadCSV = (blob: Blob, filename: string) => {
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
}
