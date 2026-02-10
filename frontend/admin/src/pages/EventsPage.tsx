import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, Calendar, Users, Eye, Clock } from 'lucide-react'
import toast from 'react-hot-toast'
import { getEvents, deleteEvent } from '../services/eventService'
import type { Event } from '../types/event'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import SkeletonTable from '../components/ui/SkeletonTable'
import EventFormModal from '../components/events/EventFormModal'
import AttendeeListModal from '../components/events/AttendeeListModal'
import MainLayout from '../components/layout/MainLayout'

export default function EventsPage() {
    const [events, setEvents] = useState<Event[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [editingEvent, setEditingEvent] = useState<Event | null>(null)
    const [viewingRSVPs, setViewingRSVPs] = useState<Event | null>(null)
    const [statusFilter, setStatusFilter] = useState<'all' | 'scheduled' | 'completed' | 'cancelled'>('all')
    const [upcomingOnly, setUpcomingOnly] = useState(false)

    const loadEvents = async () => {
        try {
            setLoading(true)
            setError('')
            const params: any = {}
            if (statusFilter !== 'all') {
                params.status = statusFilter
            }
            if (upcomingOnly) {
                params.upcoming = true
            }
            const data = await getEvents(params)
            setEvents(data)
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Erro ao carregar eventos')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadEvents()
    }, [statusFilter, upcomingOnly])

    const handleDelete = async (id: string, title: string) => {
        if (!confirm(`Tem certeza que deseja cancelar o evento "${title}"?`)) {
            return
        }

        toast.promise(
            deleteEvent(id).then(() => loadEvents()),
            {
                loading: 'Cancelando evento...',
                success: `Evento "${title}" cancelado com sucesso!`,
                error: (err) => err.response?.data?.detail || 'Erro ao cancelar evento',
            }
        ).catch((err: any) => {
            setError(err.response?.data?.detail || 'Erro ao cancelar evento')
        })
    }

    const handleEdit = (event: Event) => {
        setEditingEvent(event)
        setShowCreateModal(true)
    }

    const handleCloseModal = () => {
        setShowCreateModal(false)
        setEditingEvent(null)
    }

    const handleSuccess = () => {
        handleCloseModal()
        loadEvents()
    }

    const handleViewRSVPs = (event: Event) => {
        setViewingRSVPs(event)
    }

    const handleCloseRSVPsModal = () => {
        setViewingRSVPs(null)
        loadEvents()
    }

    // Stats
    const totalEvents = events.length
    const scheduledEvents = events.filter(e => e.status === 'scheduled').length
    const completedEvents = events.filter(e => e.status === 'completed').length

    // Format date/time
    const formatDateTime = (dateStr: string, timeStr: string) => {
        const date = new Date(dateStr)
        const time = new Date(timeStr)
        return `${date.toLocaleDateString('pt-BR')} às ${time.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`
    }

    const getStatusBadge = (status: string) => {
        const statusMap = {
            scheduled: { color: 'cyan', label: 'Agendado' },
            ongoing: { color: 'yellow', label: 'Em Andamento' },
            completed: { color: 'terminalgreen', label: 'Concluído' },
            cancelled: { color: 'alertorange', label: 'Cancelado' }
        }
        const config = statusMap[status as keyof typeof statusMap] || statusMap.scheduled
        return (
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-${config.color}/20 text-${config.color} border border-${config.color}/30`}>
                {config.label}
            </span>
        )
    }

    return (
        <MainLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-cyan text-glow-cyan">Gestão de Eventos</h1>
                        <p className="text-metal-silver/80 mt-1">Gerencie eventos e controle de participantes</p>
                    </div>
                    <Button onClick={() => setShowCreateModal(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Criar Evento
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card hover>
                        <div className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-metal-silver/70">Total de Eventos</p>
                                    <p className="text-3xl font-bold text-cyan mt-2">{totalEvents}</p>
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
                                    <p className="text-sm text-metal-silver/70">Agendados</p>
                                    <p className="text-3xl font-bold text-yellow-400 mt-2">{scheduledEvents}</p>
                                </div>
                                <div className="p-3 bg-yellow-400/10 border border-yellow-400/30 rounded-lg">
                                    <Clock className="w-8 h-8 text-yellow-400" />
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card hover>
                        <div className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-metal-silver/70">Concluídos</p>
                                    <p className="text-3xl font-bold text-terminalgreen mt-2">{completedEvents}</p>
                                </div>
                                <div className="p-3 bg-terminalgreen/10 border border-terminalgreen/30 rounded-lg">
                                    <Users className="w-8 h-8 text-terminalgreen" />
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Filters */}
                <Card>
                    <div className="p-4 border-b border-cyan-glow/20">
                        <div className="flex gap-2 flex-wrap items-center">
                            <button
                                onClick={() => setStatusFilter('all')}
                                className={`px-4 py-2 rounded-lg transition-colors ${statusFilter === 'all'
                                    ? 'bg-cyan text-coal font-medium'
                                    : 'bg-coal-light text-metal-silver hover:bg-coal'
                                    }`}
                            >
                                Todos
                            </button>
                            <button
                                onClick={() => setStatusFilter('scheduled')}
                                className={`px-4 py-2 rounded-lg transition-colors ${statusFilter === 'scheduled'
                                    ? 'bg-yellow-400 text-coal font-medium'
                                    : 'bg-coal-light text-metal-silver hover:bg-coal'
                                    }`}
                            >
                                Agendados
                            </button>
                            <button
                                onClick={() => setStatusFilter('completed')}
                                className={`px-4 py-2 rounded-lg transition-colors ${statusFilter === 'completed'
                                    ? 'bg-terminalgreen text-coal font-medium'
                                    : 'bg-coal-light text-metal-silver hover:bg-coal'
                                    }`}
                            >
                                Concluídos
                            </button>
                            <button
                                onClick={() => setStatusFilter('cancelled')}
                                className={`px-4 py-2 rounded-lg transition-colors ${statusFilter === 'cancelled'
                                    ? 'bg-alertorange text-coal font-medium'
                                    : 'bg-coal-light text-metal-silver hover:bg-coal'
                                    }`}
                            >
                                Cancelados
                            </button>

                            <div className="ml-auto flex items-center gap-2">
                                <label className="flex items-center gap-2 text-metal-silver cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={upcomingOnly}
                                        onChange={(e) => setUpcomingOnly(e.target.checked)}
                                        className="rounded border-cyan-glow/30 bg-coal text-cyan focus:ring-cyan focus:ring-offset-0"
                                    />
                                    <span className="text-sm">Apenas futuros</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Error message */}
                    {error && (
                        <div className="m-4 bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded">
                            {error}
                        </div>
                    )}

                    {/* Table */}
                    <div className="p-6">
                        <h2 className="text-xl font-semibold text-cyan mb-4">Eventos</h2>

                        {loading ? (
                            <SkeletonTable columns={6} rows={6} />
                        ) : events.length === 0 ? (
                            <div className="text-center py-8 text-metal-silver">
                                Nenhum evento encontrado. Clique em "Criar Evento" para começar.
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-cyan-glow/20">
                                            <th className="text-left py-3 px-4 text-metal-silver/70 font-medium">Título</th>
                                            <th className="text-left py-3 px-4 text-metal-silver/70 font-medium">Data/Hora</th>
                                            <th className="text-left py-3 px-4 text-metal-silver/70 font-medium">Local</th>
                                            <th className="text-left py-3 px-4 text-metal-silver/70 font-medium">Capacidade</th>
                                            <th className="text-left py-3 px-4 text-metal-silver/70 font-medium">Status</th>
                                            <th className="text-right py-3 px-4 text-metal-silver/70 font-medium">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {events.map((event) => (
                                            <tr key={event.id} className="border-b border-cyan-glow/10 hover:bg-coal-light/30">
                                                <td className="py-3 px-4">
                                                    <div>
                                                        <p className="text-cyan font-medium">{event.title}</p>
                                                        {event.description && (
                                                            <p className="text-sm text-metal-silver/60 mt-1 line-clamp-1">{event.description}</p>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4 text-metal-silver text-sm">
                                                    {formatDateTime(event.event_date, event.start_time)}
                                                </td>
                                                <td className="py-3 px-4 text-metal-silver">
                                                    {event.location || '-'}
                                                </td>
                                                <td className="py-3 px-4 text-metal-silver">
                                                    {event.capacity ? `${event.attendee_count || 0}/${event.capacity}` : 'Sem limite'}
                                                </td>
                                                <td className="py-3 px-4">
                                                    {getStatusBadge(event.status)}
                                                </td>
                                                <td className="py-3 px-4">
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            onClick={() => handleViewRSVPs(event)}
                                                            className="p-2 text-terminalgreen hover:bg-terminalgreen/20 rounded transition-colors"
                                                            title="Ver Participantes"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </button>
                                                        {event.status !== 'cancelled' && (
                                                            <>
                                                                <button
                                                                    onClick={() => handleEdit(event)}
                                                                    className="p-2 text-cyan hover:bg-cyan/20 rounded transition-colors"
                                                                    title="Editar"
                                                                >
                                                                    <Edit2 className="w-4 h-4" />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDelete(event.id, event.title)}
                                                                    className="p-2 text-alertorange hover:bg-alertorange/20 rounded transition-colors"
                                                                    title="Cancelar"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </Card>

                {/* Create/Edit Modal */}
                {showCreateModal && (
                    <EventFormModal
                        event={editingEvent}
                        onClose={handleCloseModal}
                        onSuccess={handleSuccess}
                    />
                )}

                {/* Attendee List Modal */}
                {viewingRSVPs && (
                    <AttendeeListModal
                        event={viewingRSVPs}
                        onClose={handleCloseRSVPsModal}
                    />
                )}
            </div>
        </MainLayout>
    )
}
