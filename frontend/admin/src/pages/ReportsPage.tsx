import { useState, useEffect } from 'react'
import { BarChart3, Calendar, Download, TrendingUp } from 'lucide-react'
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

                {/* Content Area - Will be filled in next tasks */}
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
                            {activeTab === 'areas' && areasReport && (
                                <div className="text-metal-silver">
                                    {/* Areas report content will go here in next task */}
                                    <p className="text-center py-12">Visualização de dados será implementada na próxima tarefa</p>
                                </div>
                            )}
                            {activeTab === 'reservations' && reservationsReport && (
                                <div className="text-metal-silver">
                                    {/* Reservations report content will go here in next task */}
                                    <p className="text-center py-12">Visualização de dados será implementada na próxima tarefa</p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </MainLayout>
    )
}
