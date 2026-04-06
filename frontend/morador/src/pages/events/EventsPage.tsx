import { useState, useEffect } from 'react'
import {
    Calendar,
    Clock,
    MapPin,
    Users,
    Loader2,
    CheckCircle,
    XCircle,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { MainLayout, HologramCard, Button } from '@/components'
import { listEvents } from '@/services/eventService'
import EventDetailModal from '@/components/events/EventDetailModal'
import type { Event } from '@/types/models'

const EventsPage = () => {
    const [events, setEvents] = useState<Event[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [filter, setFilter] = useState<'upcoming' | 'past' | 'all'>('upcoming')
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    useEffect(() => {
        fetchEvents()
    }, [filter])

    const fetchEvents = async () => {
        try {
            setIsLoading(true)
            setError(null)

            const params = filter === 'all' ? {} : { upcoming: filter === 'upcoming' }
            const data = await listEvents(params)
            setEvents(data)
        } catch (err) {
            const errorMessage = 'Erro ao carregar eventos. Tente novamente.'
            setError(errorMessage)
            toast.error(errorMessage)
        } finally {
            setIsLoading(false)
        }
    }

    const handleOpenModal = (event: Event) => {
        setSelectedEvent(event)
        setIsModalOpen(true)
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
        setSelectedEvent(null)
        fetchEvents() // Refresh events after modal closes
    }

    const formatDateTime = (dateStr: string, timeStr: string) => {
        const date = new Date(dateStr)
        const time = new Date(timeStr)
        return {
            date: date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }),
            time: time.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        }
    }

    const getStatusBadge = (status: string) => {
        const statusMap = {
            scheduled: { icon: Clock, color: 'cyan', label: 'Agendado' },
            ongoing: { icon: CheckCircle, color: 'yellow-400', label: 'Em Andamento' },
            completed: { icon: CheckCircle, color: 'terminalgreen', label: 'Concluído' },
            cancelled: { icon: XCircle, color: 'criticalred', label: 'Cancelado' }
        }
        const config = statusMap[status as keyof typeof statusMap] || statusMap.scheduled
        const Icon = config.icon

        return (
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-${config.color}/20 text-${config.color} border border-${config.color}/30`}>
                <Icon className="w-3 h-3" />
                {config.label}
            </span>
        )
    }

    const filteredEvents = events.filter(event => {
        if (event.status === 'cancelled') return false // Don't show cancelled events to residents
        return true
    })

    return (
        <MainLayout>
            <div className="p-8 space-y-8">
                {/* Header */}
                <div>
                    <h1 className="text-4xl font-bold text-cyan text-glow-cyan mb-2">
                        Eventos do Condomínio
                    </h1>
                    <p className="text-metal-silver">
                        Participe dos eventos e atividades da comunidade
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="p-4 bg-criticalred/10 border border-criticalred/30 rounded-lg flex items-start gap-3">
                        <div className="text-criticalred">{error}</div>
                        <button
                            onClick={() => setError(null)}
                            className="ml-auto text-criticalred hover:text-criticalred/80"
                        >
                            ×
                        </button>
                    </div>
                )}

                {/* Filters */}
                <div className="flex gap-3">
                    <button
                        onClick={() => setFilter('upcoming')}
                        className={`px-4 py-2 rounded-lg transition-all ${
                            filter === 'upcoming'
                                ? 'bg-gradient-cyber text-coal font-bold shadow-glow'
                                : 'bg-coal-light text-metal-silver hover:bg-coal'
                        }`}
                    >
                        Próximos Eventos
                    </button>
                    <button
                        onClick={() => setFilter('past')}
                        className={`px-4 py-2 rounded-lg transition-all ${
                            filter === 'past'
                                ? 'bg-gradient-cyber text-coal font-bold shadow-glow'
                                : 'bg-coal-light text-metal-silver hover:bg-coal'
                        }`}
                    >
                        Eventos Passados
                    </button>
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-lg transition-all ${
                            filter === 'all'
                                ? 'bg-gradient-cyber text-coal font-bold shadow-glow'
                                : 'bg-coal-light text-metal-silver hover:bg-coal'
                        }`}
                    >
                        Todos
                    </button>
                </div>

                {/* Events Grid */}
                {isLoading ? (
                    <div className="flex items-center justify-center py-16">
                        <Loader2 className="w-8 h-8 text-cyan animate-spin" />
                        <span className="ml-3 text-metal-silver">Carregando eventos...</span>
                    </div>
                ) : filteredEvents.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredEvents.map((event) => {
                            const { date, time } = formatDateTime(event.event_date, event.start_time)
                            const endTime = new Date(event.end_time).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })

                            return (
                                <HologramCard
                                    key={event.id}
                                    className="p-6 hover:border-cyan/50 flex flex-col"
                                >
                                    {/* Status Badge */}
                                    <div className="mb-3">
                                        {getStatusBadge(event.status)}
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-xl font-bold text-cyan mb-2">
                                        {event.title}
                                    </h3>

                                    {/* Description */}
                                    {event.description && (
                                        <p className="text-sm text-metal-silver/70 mb-4 line-clamp-2">
                                            {event.description}
                                        </p>
                                    )}

                                    {/* Details */}
                                    <div className="space-y-2 mb-4 flex-1">
                                        <div className="flex items-center gap-2 text-sm text-metal-silver">
                                            <Calendar className="w-4 h-4 text-cyan/50" />
                                            <span>{date}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-metal-silver">
                                            <Clock className="w-4 h-4 text-cyan/50" />
                                            <span>{time} - {endTime}</span>
                                        </div>
                                        {event.location && (
                                            <div className="flex items-center gap-2 text-sm text-metal-silver">
                                                <MapPin className="w-4 h-4 text-cyan/50" />
                                                <span>{event.location}</span>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-2 text-sm text-metal-silver">
                                            <Users className="w-4 h-4 text-cyan/50" />
                                            <span>
                                                {event.capacity
                                                    ? `${event.attendee_count || 0}/${event.capacity} vagas`
                                                    : `${event.attendee_count || 0} confirmados`
                                                }
                                            </span>
                                        </div>
                                    </div>

                                    {/* Action Button */}
                                    <Button
                                        variant="primary"
                                        size="sm"
                                        fullWidth
                                        onClick={() => handleOpenModal(event)}
                                        disabled={event.status === 'cancelled'}
                                    >
                                        Ver Detalhes
                                    </Button>
                                </HologramCard>
                            )
                        })}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <Calendar className="w-16 h-16 text-metal-silver/30 mx-auto mb-4" />
                        <p className="text-metal-silver/60 text-lg">
                            {filter === 'upcoming'
                                ? 'Nenhum evento programado no momento'
                                : filter === 'past'
                                ? 'Nenhum evento passado'
                                : 'Nenhum evento disponível'
                            }
                        </p>
                    </div>
                )}
            </div>

            {/* Event Detail Modal */}
            {selectedEvent && (
                <EventDetailModal
                    isOpen={isModalOpen}
                    event={selectedEvent}
                    onClose={handleCloseModal}
                />
            )}
        </MainLayout>
    )
}

export default EventsPage
