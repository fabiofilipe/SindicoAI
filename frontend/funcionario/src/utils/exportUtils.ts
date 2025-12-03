import type { Reservation, CommonArea } from '@/types/models'

interface ExportReservation extends Reservation {
    common_area?: CommonArea
}

const getStatusLabel = (status: string): string => {
    const labels: Record<string, string> = {
        'confirmed': 'CONFIRMADA',
        'pending': 'PENDENTE',
        'cancelled': 'CANCELADA',
        'completed': 'CONCLUÍDA'
    }
    return labels[status] || status.toUpperCase()
}

const formatDate = (datetime: string): string => {
    return new Date(datetime).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    })
}

const formatTime = (datetime: string): string => {
    return new Date(datetime).toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
    })
}

/**
 * Export today's reservations to CSV
 */
export const exportDailyReport = (
    reservations: ExportReservation[],
    commonAreas: Record<string, CommonArea>
) => {
    // Filter today's reservations
    const today = new Date().toISOString().split('T')[0]
    const todayReservations = reservations.filter(r =>
        r.start_time.startsWith(today)
    )

    if (todayReservations.length === 0) {
        return { success: false, message: 'Nenhuma reserva para hoje' }
    }

    // CSV Headers
    const headers = ['Data', 'Horário Início', 'Horário Fim', 'Área Comum', 'Status', 'ID Morador']

    // CSV Rows
    const rows = todayReservations.map(r => {
        const areaName = commonAreas[r.common_area_id]?.name || 'Área Desconhecida'
        return [
            formatDate(r.start_time),
            formatTime(r.start_time),
            formatTime(r.end_time),
            areaName,
            getStatusLabel(r.status),
            r.user_id.slice(0, 8)
        ]
    })

    // Create CSV content
    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')

    // Create blob and download
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)

    link.setAttribute('href', url)
    link.setAttribute('download', `relatorio-reservas-${today}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    return {
        success: true,
        message: `Relatório exportado com ${todayReservations.length} reserva(s)`,
        count: todayReservations.length
    }
}

/**
 * Export reservations in a date range to CSV
 */
export const exportReservationsRange = (
    reservations: ExportReservation[],
    commonAreas: Record<string, CommonArea>,
    startDate: string,
    endDate: string
) => {
    const filtered = reservations.filter(r => {
        const resDate = r.start_time.split('T')[0]
        return resDate >= startDate && resDate <= endDate
    })

    if (filtered.length === 0) {
        return { success: false, message: 'Nenhuma reserva no período selecionado' }
    }

    // CSV Headers
    const headers = ['Data', 'Horário Início', 'Horário Fim', 'Área Comum', 'Status', 'ID Morador']

    // CSV Rows
    const rows = filtered.map(r => {
        const areaName = commonAreas[r.common_area_id]?.name || 'Área Desconhecida'
        return [
            formatDate(r.start_time),
            formatTime(r.start_time),
            formatTime(r.end_time),
            areaName,
            getStatusLabel(r.status),
            r.user_id.slice(0, 8)
        ]
    })

    // Create CSV content
    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')

    // Create blob and download
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)

    link.setAttribute('href', url)
    link.setAttribute('download', `relatorio-reservas-${startDate}-a-${endDate}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    return {
        success: true,
        message: `Relatório exportado com ${filtered.length} reserva(s)`,
        count: filtered.length
    }
}
