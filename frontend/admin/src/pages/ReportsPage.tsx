import { useState, useEffect } from 'react'
import { BarChart3, Calendar, Download, TrendingUp, Building2, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'
import MainLayout from '../components/layout/MainLayout'
import {
    getCommonAreasUsageReport,
    getReservationsReport,
    exportCommonAreasUsageCSV,
    exportReservationsCSV,
    downloadCSV
} from '../services/reportService'
import type { CommonAreasUsageReport, ReservationsReport } from '../types/report'

export default function ReportsPage() {
    // Date filters - default to last 30 days
    const getDefaultDates = () => {
        const end = new Date()
        const start = new Date()
        start.setDate(start.getDate() - 30)

        return {
            start: start.toISOString().split('T')[0],
            end: end.toISOString().split('T')[0]
        }
    }

    const [dateRange, setDateRange] = useState(getDefaultDates())
    const [activeTab, setActiveTab] = useState<'areas' | 'reservations'>('areas')

    // Reports data
    const [areasReport, setAreasReport] = useState<CommonAreasUsageReport | null>(null)
    const [reservationsReport, setReservationsReport] = useState<ReservationsReport | null>(null)

    // Loading states
    const [loadingAreas, setLoadingAreas] = useState(false)
    const [loadingReservations, setLoadingReservations] = useState(false)
    const [exportingCSV, setExportingCSV] = useState(false)

    const [error, setError] = useState('')

    // Load reports on mount and when date changes
    useEffect(() => {
        if (activeTab === 'areas') {
            loadAreasReport()
        } else {
            loadReservationsReport()
        }
    }, [dateRange, activeTab])

    const loadAreasReport = async () => {
        try {
            setLoadingAreas(true)
            setError('')
            const data = await getCommonAreasUsageReport(dateRange.start, dateRange.end)
            setAreasReport(data)
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Erro ao carregar relatório de áreas comuns')
        } finally {
            setLoadingAreas(false)
        }
    }

    const loadReservationsReport = async () => {
        try {
            setLoadingReservations(true)
            setError('')
            const data = await getReservationsReport({
                start_date: dateRange.start,
                end_date: dateRange.end
            })
            setReservationsReport(data)
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Erro ao carregar relatório de reservas')
        } finally {
            setLoadingReservations(false)
        }
    }

    const handleExportCSV = async () => {
        try {
            setExportingCSV(true)
            setError('')

            if (activeTab === 'areas') {
                const blob = await exportCommonAreasUsageCSV(dateRange.start, dateRange.end)
                downloadCSV(blob, `relatorio_areas_comuns_${dateRange.start}_${dateRange.end}.csv`)
            } else {
                const blob = await exportReservationsCSV({
                    start_date: dateRange.start,
                    end_date: dateRange.end
                })
                downloadCSV(blob, `relatorio_reservas_${dateRange.start}_${dateRange.end}.csv`)
            }
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Erro ao exportar relatório')
        } finally {
            setExportingCSV(false)
        }
    }

    const handleApplyFilters = () => {
        if (activeTab === 'areas') {
            loadAreasReport()
        } else {
            loadReservationsReport()
        }
    }

    const isLoading = loadingAreas || loadingReservations

    return (
        <MainLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-cyan text-glow-cyan">Relatórios</h1>
                        <p className="text-metal-silver/80 mt-1">Análise de uso de áreas comuns e reservas</p>
                    </div>
                    <Button
                        onClick={handleExportCSV}
                        disabled={isLoading || exportingCSV}
                        variant="outline"
                    >
                        <Download className="w-4 h-4 mr-2" />
                        {exportingCSV ? 'Exportando...' : 'Exportar CSV'}
                    </Button>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg">
                        {error}
                    </div>
                )}

                {/* Date Filters */}
                <Card>
                    <div className="p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Calendar className="w-5 h-5 text-cyan" />
                            <h2 className="text-lg font-bold text-cyan">Filtros de Período</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Data Início
                                </label>
                                <Input
                                    type="date"
                                    value={dateRange.start}
                                    onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Data Fim
                                </label>
                                <Input
                                    type="date"
                                    value={dateRange.end}
                                    onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                                />
                            </div>

                            <div className="flex items-end">
                                <Button
                                    onClick={handleApplyFilters}
                                    disabled={isLoading}
                                    className="w-full"
                                >
                                    Aplicar Filtros
                                </Button>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Tabs */}
                <div className="flex gap-2">
                    <button
                        onClick={() => setActiveTab('areas')}
                        className={`
                            flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all
                            ${activeTab === 'areas'
                                ? 'bg-cyan/10 text-cyan border border-cyan/30'
                                : 'bg-coal-light text-metal-silver hover:bg-coal'
                            }
                        `}
                    >
                        <BarChart3 className="w-5 h-5" />
                        Uso de Áreas Comuns
                    </button>
                    <button
                        onClick={() => setActiveTab('reservations')}
                        className={`
                            flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all
                            ${activeTab === 'reservations'
                                ? 'bg-cyan/10 text-cyan border border-cyan/30'
                                : 'bg-coal-light text-metal-silver hover:bg-coal'
                            }
                        `}
                    >
                        <TrendingUp className="w-5 h-5" />
                        Reservas por Período
                    </button>
                </div>

                {/* Content Area */}
                <div className="min-h-[400px]">
                    {isLoading ? (
                        <Card>
                            <div className="p-12 text-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan mx-auto mb-4"></div>
                                <p className="text-metal-silver">Carregando relatório...</p>
                            </div>
                        </Card>
                    ) : (
                        <>
                            {/* Areas Report */}
                            {activeTab === 'areas' && areasReport && (
                                <div className="space-y-6">
                                    {/* Summary Cards */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <Card hover>
                                            <div className="p-6">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm text-metal-silver/70">Total de Reservas</p>
                                                        <p className="text-3xl font-bold text-cyan mt-2">
                                                            {areasReport.total_reservations}
                                                        </p>
                                                    </div>
                                                    <div className="p-3 bg-cyan/10 border border-cyan/30 rounded-lg">
                                                        <Calendar className="w-8 h-8 text-cyan" />
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>

                                        <Card hover>
                                            <div className="p-6">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm text-metal-silver/70">Áreas Utilizadas</p>
                                                        <p className="text-3xl font-bold text-cyan mt-2">
                                                            {areasReport.total_areas_used}
                                                        </p>
                                                    </div>
                                                    <div className="p-3 bg-cyan/10 border border-cyan/30 rounded-lg">
                                                        <Building2 className="w-8 h-8 text-cyan" />
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>

                                        <Card hover>
                                            <div className="p-6">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm text-metal-silver/70">Horas Totais</p>
                                                        <p className="text-3xl font-bold text-cyan mt-2">
                                                            {areasReport.areas_stats.reduce((acc, area) => acc + area.total_hours_reserved, 0).toFixed(1)}h
                                                        </p>
                                                    </div>
                                                    <div className="p-3 bg-cyan/10 border border-cyan/30 rounded-lg">
                                                        <Clock className="w-8 h-8 text-cyan" />
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    </div>

                                    {/* Areas Table */}
                                    <Card>
                                        <div className="p-6">
                                            <h3 className="text-xl font-bold text-cyan mb-4">Estatísticas por Área</h3>
                                            <div className="overflow-x-auto">
                                                <table className="w-full">
                                                    <thead>
                                                        <tr className="border-b border-cyan-glow/20">
                                                            <th className="text-left py-3 px-4 text-sm font-medium text-metal-silver">
                                                                Área Comum
                                                            </th>
                                                            <th className="text-center py-3 px-4 text-sm font-medium text-metal-silver">
                                                                Reservas
                                                            </th>
                                                            <th className="text-center py-3 px-4 text-sm font-medium text-metal-silver">
                                                                Horas Reservadas
                                                            </th>
                                                            <th className="text-center py-3 px-4 text-sm font-medium text-metal-silver">
                                                                Dia Mais Popular
                                                            </th>
                                                            <th className="text-center py-3 px-4 text-sm font-medium text-metal-silver">
                                                                Duração Média (h)
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {areasReport.areas_stats.length === 0 ? (
                                                            <tr>
                                                                <td colSpan={5} className="text-center py-8 text-metal-silver/60">
                                                                    Nenhuma área utilizada neste período
                                                                </td>
                                                            </tr>
                                                        ) : (
                                                            areasReport.areas_stats.map((area, index) => (
                                                                <tr
                                                                    key={area.common_area_id}
                                                                    className="border-b border-cyan-glow/10 hover:bg-coal-light transition-colors"
                                                                >
                                                                    <td className="py-3 px-4 text-metal-silver">
                                                                        {area.common_area_name}
                                                                    </td>
                                                                    <td className="py-3 px-4 text-center text-cyan font-medium">
                                                                        {area.total_reservations}
                                                                    </td>
                                                                    <td className="py-3 px-4 text-center text-metal-silver">
                                                                        {area.total_hours_reserved}h
                                                                    </td>
                                                                    <td className="py-3 px-4 text-center text-metal-silver">
                                                                        {area.most_popular_day || 'N/A'}
                                                                    </td>
                                                                    <td className="py-3 px-4 text-center text-metal-silver">
                                                                        {area.average_duration_hours?.toFixed(1) || 'N/A'}
                                                                    </td>
                                                                </tr>
                                                            ))
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </Card>
                                </div>
                            )}

                            {/* Reservations Report */}
                            {activeTab === 'reservations' && reservationsReport && (
                                <div className="space-y-6">
                                    {/* Summary Cards */}
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                        <Card hover>
                                            <div className="p-6">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm text-metal-silver/70">Total</p>
                                                        <p className="text-3xl font-bold text-cyan mt-2">
                                                            {reservationsReport.total_reservations}
                                                        </p>
                                                    </div>
                                                    <div className="p-3 bg-cyan/10 border border-cyan/30 rounded-lg">
                                                        <Calendar className="w-8 h-8 text-cyan" />
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>

                                        <Card hover>
                                            <div className="p-6">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm text-metal-silver/70">Confirmadas</p>
                                                        <p className="text-3xl font-bold text-green-500 mt-2">
                                                            {reservationsReport.confirmed_count}
                                                        </p>
                                                    </div>
                                                    <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                                                        <CheckCircle className="w-8 h-8 text-green-500" />
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>

                                        <Card hover>
                                            <div className="p-6">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm text-metal-silver/70">Pendentes</p>
                                                        <p className="text-3xl font-bold text-yellow-500 mt-2">
                                                            {reservationsReport.pending_count}
                                                        </p>
                                                    </div>
                                                    <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                                                        <AlertCircle className="w-8 h-8 text-yellow-500" />
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>

                                        <Card hover>
                                            <div className="p-6">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm text-metal-silver/70">Canceladas</p>
                                                        <p className="text-3xl font-bold text-red-500 mt-2">
                                                            {reservationsReport.cancelled_count}
                                                        </p>
                                                    </div>
                                                    <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                                                        <XCircle className="w-8 h-8 text-red-500" />
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    </div>

                                    {/* Reservations Table */}
                                    <Card>
                                        <div className="p-6">
                                            <h3 className="text-xl font-bold text-cyan mb-4">Reservas Detalhadas</h3>
                                            <div className="overflow-x-auto">
                                                <table className="w-full">
                                                    <thead>
                                                        <tr className="border-b border-cyan-glow/20">
                                                            <th className="text-left py-3 px-4 text-sm font-medium text-metal-silver">
                                                                Área Comum
                                                            </th>
                                                            <th className="text-left py-3 px-4 text-sm font-medium text-metal-silver">
                                                                Usuário
                                                            </th>
                                                            <th className="text-center py-3 px-4 text-sm font-medium text-metal-silver">
                                                                Unidade
                                                            </th>
                                                            <th className="text-center py-3 px-4 text-sm font-medium text-metal-silver">
                                                                Data/Hora
                                                            </th>
                                                            <th className="text-center py-3 px-4 text-sm font-medium text-metal-silver">
                                                                Duração
                                                            </th>
                                                            <th className="text-center py-3 px-4 text-sm font-medium text-metal-silver">
                                                                Status
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {reservationsReport.reservations.length === 0 ? (
                                                            <tr>
                                                                <td colSpan={6} className="text-center py-8 text-metal-silver/60">
                                                                    Nenhuma reserva encontrada neste período
                                                                </td>
                                                            </tr>
                                                        ) : (
                                                            reservationsReport.reservations.map((reservation) => (
                                                                <tr
                                                                    key={reservation.id}
                                                                    className="border-b border-cyan-glow/10 hover:bg-coal-light transition-colors"
                                                                >
                                                                    <td className="py-3 px-4 text-metal-silver">
                                                                        {reservation.common_area_name}
                                                                    </td>
                                                                    <td className="py-3 px-4 text-metal-silver">
                                                                        <div>
                                                                            <p className="font-medium">{reservation.user_name}</p>
                                                                            <p className="text-xs text-metal-silver/60">{reservation.user_email}</p>
                                                                        </div>
                                                                    </td>
                                                                    <td className="py-3 px-4 text-center text-metal-silver">
                                                                        {reservation.unit_number || 'N/A'}
                                                                    </td>
                                                                    <td className="py-3 px-4 text-center text-metal-silver text-sm">
                                                                        {new Date(reservation.start_time).toLocaleString('pt-BR', {
                                                                            day: '2-digit',
                                                                            month: '2-digit',
                                                                            hour: '2-digit',
                                                                            minute: '2-digit'
                                                                        })}
                                                                    </td>
                                                                    <td className="py-3 px-4 text-center text-metal-silver">
                                                                        {reservation.duration_hours}h
                                                                    </td>
                                                                    <td className="py-3 px-4 text-center">
                                                                        <span className={`
                                                                            px-3 py-1 rounded-full text-xs font-medium
                                                                            ${reservation.status === 'confirmed' ? 'bg-green-500/10 text-green-500' : ''}
                                                                            ${reservation.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' : ''}
                                                                            ${reservation.status === 'cancelled' ? 'bg-red-500/10 text-red-500' : ''}
                                                                        `}>
                                                                            {reservation.status === 'confirmed' ? 'Confirmada' : ''}
                                                                            {reservation.status === 'pending' ? 'Pendente' : ''}
                                                                            {reservation.status === 'cancelled' ? 'Cancelada' : ''}
                                                                        </span>
                                                                    </td>
                                                                </tr>
                                                            ))
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </Card>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </MainLayout>
    )
}
